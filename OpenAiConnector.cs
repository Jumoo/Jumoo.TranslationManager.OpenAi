using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

using Azure.AI.OpenAI;

using HtmlAgilityPack;

using Jumoo.TranslationManager.Core;
using Jumoo.TranslationManager.Core.Configuration;
using Jumoo.TranslationManager.Core.Models;
using Jumoo.TranslationManager.Core.Providers;
using Jumoo.TranslationManager.OpenAi.Models;
using Jumoo.TranslationManager.OpenAi.Services;
using Jumoo.TranslationManager.Utilities;

using Microsoft.Extensions.Logging;

using Umbraco.Cms.Core;

namespace Jumoo.TranslationManager.OpenAi;
public class OpenAiConnector : ITranslationProvider
{
    public static string ConnectorName = "OpenAi Connector";
    public static string ConnectorAlias = "openAiConnector";
    public static string ConnectorVersion = typeof(OpenAiConnector).Assembly.GetName().Version.ToString(3);
    public static string ConnectorPluginPath = "/App_Plugins/Translations.OpenAi/";


    private readonly TranslationConfigService _configService;
    private readonly ILogger<OpenAiConnector> _logger;
    private readonly OpenAiService _openAiService;

    public string Name => ConnectorName;
    public string Alias => ConnectorAlias;
    public Guid Key => Guid.Parse("{D60C3B07-2FCE-4568-8A1D-C3286A73DF8A}");

    private OpenAiSettings _settings;

    private CompletionsOptions _completionsOptions;

    private int _throttle = 300;
    private bool _split = false;
    private bool _asHtml = true;

    public OpenAiConnector(TranslationConfigService configService, ILogger<OpenAiConnector> logger, OpenAiService openAiService)
    {
        _settings = new OpenAiSettings();
        
        // defaults. 
        _completionsOptions = new CompletionsOptions
        {
            MaxTokens = 500,
            Temperature = 0f,
            FrequencyPenalty = 0.0f,
            PresencePenalty = 0.0f,
            NucleusSamplingFactor = 1
        };

        _configService = configService;
        _logger = logger;
        _openAiService = openAiService;
    }

    public TranslationProviderViews Views => new TranslationProviderViews()
    {
        Config = TranslateUriUtility.ToAbsolute(ConnectorPluginPath + "config.html"),
        Pending = TranslateUriUtility.ToAbsolute(ConnectorPluginPath + "pending.html"),
    };

    public async Task<Attempt<TranslationJob>> Submit(TranslationJob job)
    {
        if (string.IsNullOrEmpty(_settings.Key))
            throw new Exception("OpenAi Key is missing");

        var sourceLang = job.SourceCulture.DisplayName;
        var targetLang = job.TargetCulture.DisplayName;

        _logger.LogDebug("Submitting translations via OpenApi");

        foreach(var node in job.Nodes)
        {
            _logger.LogDebug("Translating: {nodeId}", node.MasterNodeId);

            foreach(var group in node.Groups)
            {
                foreach (var property in group.Properties)
                {
                    _logger.LogDebug("Translation: {nodeId} {group} {property}",
                        node.MasterNodeId, group, property);

                    var result = await GetTranslatedValue(
                        property.Source, property.Target, sourceLang, targetLang);
                    if (result == null)
                        return Attempt<TranslationJob>.Fail(new Exception("No value translated"));

                    property.Target = result;
                }

                if (_throttle > 0)
                {
                    _logger.LogDebug("Throttle: Waiting... {0}ms", _throttle);
                    await Task.Delay(_throttle);
                }
            }
        }

        job.Status = JobStatus.Received;
        return Attempt.Succeed(job);
    }

    private async Task<TranslationValue> GetTranslatedValue(TranslationValue source, TranslationValue target, string sourceLang, string targetLang)
    {
        _logger.LogDebug("GetTranslationValue: {name}", source.DisplayName);

        if (source.HasChildValues())
        {
            foreach(var innerValue in source.InnerValues) 
            {
                _logger.LogDebug("GetTranslatedValue: Child : {key}", innerValue.Key);

                var innerTarget = target.GetInnerValue(innerValue.Key);
                if (innerTarget == null)
                {
                    _logger.LogWarning("No inner target to match child (bad setup)");
                    continue;
                }

                var translatedValue = await GetTranslatedValue(innerValue.Value, innerTarget, sourceLang, targetLang);
                if (translatedValue != null)
                {
                    innerTarget = translatedValue;
                }
            }
        }

        if (!string.IsNullOrWhiteSpace(source.Value))
        {
            _logger.LogDebug("Translating: [{value}] [{source} to {target}]",
                source.Value, sourceLang, targetLang);

            // has a value to translate 
            if (_split)
            {
                _logger.LogDebug("Splitting");

                // if it's html, we split it up. 
                target.Value = await TranslateHtmlValue(source.Value, sourceLang, targetLang);
                target.Translated = true;
            }
            else
            {
                _logger.LogDebug("Not splitting, treating as single string");

                target.Value = await TranslateStringValue(source.Value, sourceLang, targetLang);
                target.Translated = true;
            }
        }

        return target;
    }


    /// <summary>
    ///  translate the text as if it's html, 
    ///  We split by top level node (so hopefully paragraphs)
    ///  and return that 
    /// </summary>
    private async Task<string> TranslateHtmlValue(string source, string sourceLang, string targetLang)
    {
        if (!IsHtml(source))
            return await TranslateStringValue(source, sourceLang, targetLang);

        var doc = new HtmlDocument();
        doc.LoadHtml(source);

        return await TranslateHtmlNodes(doc.DocumentNode.ChildNodes, sourceLang, targetLang);
    }

    private async Task<string> TranslateHtmlNodes(HtmlNodeCollection nodes, string sourceLang, string targetLang)
    {
        _logger.LogDebug("Treating as Html");

        var result = "";

        List<string> values = new List<string>();

        foreach (var node in nodes)
        {
            var value = node.OuterHtml;
            if (!string.IsNullOrWhiteSpace(value))
            {
                if (value.Length > 5000)
                {
                    if (node.HasChildNodes)
                    {
                        // if we get here then the bulk values up and send process won't work.
                        // (because we need to know that the translations are wrapped in a html tag
                        // we haven't sent to translation)

                        // we have to send what we have already done to translation, 
                        result += await TranslateStringValues(values, sourceLang, targetLang, _asHtml);

                        // and then send this block to translation
                        var translatedResult = await TranslateHtmlNodes(node.ChildNodes, sourceLang, targetLang);
                        result += $"<{node.Name}>{translatedResult}<{node.Name}>";

                        // and then resume adding things to a now empty list, 
                        values.Clear();
                    }
                    else
                    {
                        _logger.LogWarning("Splitting single html element that spans more than 5000 charecters. " +
                            "This is larger than the request limit, splitting may result in some issues with translation.");

                        // we attempt to split the tag, we also wrap it in the nodeName, to make it fit
                        var innerValue = node.InnerHtml;

                        // take the tag name and the braces (< > < / > ) from the 5000 budget. 
                        var size = 4995 - (node.Name.Length * 2);
                        values.AddRange(Split(innerValue, size, node.Name));
                    }
                }
                else
                {
                    values.Add(value);
                }
            }
        }

        if (values.Count > 0)
        {
            result += await TranslateStringValues(values, sourceLang, targetLang, _asHtml);
        }

        return result;
    }

    /// <summary>
    ///  translates a string using the api, we assume the string isn't anything
    ///  fancy, and if it's super long, we just hard split it at 5000 chars
    /// </summary>
    private async Task<string> TranslateStringValue(string source, string sourceLang, string targetLang)
    {
        var values = Split(source, 5000);
        return await TranslateStringValues(values, sourceLang, targetLang, false);
    }

    private List<string> GetBlocks(IList<string> values, int start, out int end)
    {
        int pos = start;
        var block = new List<string>();
        var length = 0;
        while (pos < values.Count && block.Count < 25)
        {
            length += values[pos].Length;
            if (length < 5000)
            {
                block.Add(values[pos]);
            }
            else
            {
                break;
            }
            pos++;
        }

        end = pos;

        return block;
    }


    private IEnumerable<string> Split(string str, int maxChunkSize, string surroundingTag = "")
    {
        for (int i = 0; i < str.Length; i += maxChunkSize)
        {
            var chunk = str.Substring(i, Math.Min(maxChunkSize, str.Length - i));

            if (!string.IsNullOrWhiteSpace(surroundingTag))
            {
                yield return $"<{surroundingTag}>{chunk}</{surroundingTag}>";
            }
            else
            {
                yield return chunk;
            }
        }
    }

    private bool IsHtml(string text)
    {
        if (!string.IsNullOrWhiteSpace(text))
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(text);
            return !doc.DocumentNode.ChildNodes.All(x => x.NodeType == HtmlNodeType.Text);
        }

        return false;
    }

    /// <summary>
    ///  bit that calls the API to do the translation.
    /// </summary>
    private async Task<string> TranslateStringValues(IEnumerable<string> values, string sourceLang, string targetLang, bool isHtml)
    {
        _logger.LogDebug("Translating: {count} values", values.Count());

        var valueList = values.ToList(); ;

        var translatedText = new StringBuilder();

        _logger.LogDebug("Splitting: {count} values", valueList.Count);
        int end = 0;
        while (end < valueList.Count)
        {
            var block = GetBlocks(valueList, end, out end).ToList();

            if (block.Count > 0)
            {
                _logger.LogDebug("Blocks : {count}, {end}", block.Count, end);
                _logger.LogDebug("Translating: {count} as one chunk", block.Count);
                _logger.LogDebug("Chunks: {blocks}", string.Join("\r\n", block));

                foreach (var b in block)
                {
                    _logger.LogDebug("Chunk {length}", b.Length);
                }

                _openAiService.UpdateSettings(_settings, _completionsOptions);

                var translated = await _openAiService.Translate(block, sourceLang, targetLang, isHtml);
                var text = translated
                    .Select(x => x);

                _logger.LogDebug("Returned: {count} translated values", text.Count());

                translatedText.Append(string.Join("", text));
            }
            else
            {
                _logger.LogDebug("Empty Block");
                break;
            }
        }

        _logger.LogDebug("Translated: {translated}", translatedText.ToString());
        return translatedText.ToString();
    }




    public bool Active() => !string.IsNullOrWhiteSpace(_settings.Key);

    public bool CanTranslate(TranslationJob job) => true;

    public void Reload()
    {
        _settings.Key = _configService.GetProviderSetting(this.Alias, "key", "");
        _settings.DeploymentId = _configService.GetProviderSetting(this.Alias, "model", "text-davinci-003");
        _settings.Endpoint = _configService.GetProviderSetting(this.Alias, "endpoint", string.Empty);

        _split = _configService.GetProviderSetting(this.Alias, "split", false);
        _asHtml = _configService.GetProviderSetting(this.Alias, "asHtml", false);

        LoadCompleationOptions();
    }

    private void LoadCompleationOptions()
    {
        // advanced options loaded here.
        _completionsOptions.MaxTokens = _configService.GetProviderSetting(this.Alias, "maxTokens", 500);
        _completionsOptions.Temperature = _configService.GetProviderSetting(this.Alias, "temperature", 0f);
        _completionsOptions.FrequencyPenalty = _configService.GetProviderSetting(this.Alias, "frequencyPenalty", 0.0f);
        _completionsOptions.PresencePenalty = _configService.GetProviderSetting(this.Alias, "presencePenalty", 0.0f);
        _completionsOptions.NucleusSamplingFactor = _configService.GetProviderSetting(this.Alias, "nucleusSamplingFactor", 1);
    }

    public IEnumerable<string> GetTargetLanguages(string sourceLanguage)
        => Enumerable.Empty<string>();

    public Task<Attempt<TranslationJob>> Check(TranslationJob job)
        => Task.FromResult(Attempt.Succeed(job));

    public Task<Attempt<TranslationJob>> Cancel(TranslationJob job)
        => Task.FromResult(Attempt.Succeed(job));

    public Task<Attempt<TranslationJob>> Remove(TranslationJob job)
        => Task.FromResult(Attempt.Succeed(job));
}
