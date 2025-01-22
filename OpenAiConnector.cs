using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using HtmlAgilityPack;

using Jumoo.TranslationManager.Core;
using Jumoo.TranslationManager.Core.Configuration;
using Jumoo.TranslationManager.Core.Hubs;
using Jumoo.TranslationManager.Core.Models;
using Jumoo.TranslationManager.Core.Providers;
using Jumoo.TranslationManager.OpenAi.Models;
using Jumoo.TranslationManager.OpenAi.Services;
using Jumoo.TranslationManager.Utilities;

using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

using Umbraco.Cms.Core;
using Umbraco.Extensions;

namespace Jumoo.TranslationManager.OpenAi;

public class OpenAiConnector : ITranslationProvider
{
    public static string ConnectorName = "OpenAi Connector";
    public static string ConnectorAlias = "openAiConnector";
    public static string ConnectorVersion = typeof(OpenAiConnector).Assembly.GetName().Version.ToString(3);
#if UMB_14_OR_GREATER
    public static string ConnectorPluginPath = "/App_Plugins/Translations.OpenAi/modern/";
#else
    public static string ConnectorPluginPath = "/App_Plugins/Translations.OpenAi/legacy/";
#endif


    private readonly TranslationConfigService _configService;
    private readonly ILogger<OpenAiConnector> _logger;
    private readonly IHubContext<TranslationHub> _hubContext;

    private readonly OpenAIServiceFactory _openAIServiceFactory;
    private IOpenAiTranslationService _openAiService;

    public string Name => ConnectorName;
    public string Alias => ConnectorAlias;
    public Guid Key => Guid.Parse("{D60C3B07-2FCE-4568-8A1D-C3286A73DF8A}");


    private string _aiServiceName = nameof(BetalgoOpenAiService);
    private int _throttle = 300;
    private bool _split = false;
    private bool _asHtml = true;
    private string _model = OpenAIConstants.DefaultModel;
    private string _prompt = OpenAIConstants.DefaultPrompt;
    private string _systemPrompt = OpenAIConstants.DefaultSystemPrompt;

    public OpenAiConnector(
        TranslationConfigService configService,
        ILogger<OpenAiConnector> logger,
        OpenAIServiceFactory openAIServiceFactory,
        IHubContext<TranslationHub> hubContext)
    {

        // defaults. 
        _configService = configService;
        _logger = logger;
        _openAIServiceFactory = openAIServiceFactory;
        _hubContext = hubContext;

        Reload();
    }

    public TranslationProviderViews Views => new TranslationProviderViews()
    {
#if UMB_14_OR_GREATER
        Config = "jumoo-openai-config",
        Pending = "jumoo-openai-pending"
#else
        Config = TranslateUriUtility.ToAbsolute(ConnectorPluginPath + "config.html"),
        Pending = TranslateUriUtility.ToAbsolute(ConnectorPluginPath + "pending.html")
#endif
    };

    public async Task<Attempt<TranslationJob>> Submit(TranslationJob job)
    {
        if (!_openAiService.Enabled())
            throw new Exception("OpenAi is not configured");

        try
        {
            var sourceLang = job.SourceCulture.DisplayName;
            var targetLang = job.TargetCulture.DisplayName;

            _logger.LogDebug("Submitting translations via OpenApi");

            var hub = GetTranslationClientHub();
            int count = 0;


            foreach (var node in job.Nodes)
            {
                _logger.LogDebug("Translating: {nodeId}", node.MasterNodeId);

                hub.SendMessage($"Translating {node.MasterNodeName} via OpenAI");

                foreach (var group in node.Groups)
                {
                    foreach (var property in group.Properties)
                    {
                        count++;

                        _logger.LogDebug("Translation: {nodeId} {group} {property}",
                            node.MasterNodeId, group, property);

                        hub.SendMessage($"Translating {node.MasterNodeName} via OpenAI - {count}");


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
#if NET7_0_OR_GREATER
            job.ProviderStatus = "Translated via OpenAI";
#endif
            return Attempt.Succeed(job);
        }
        catch(Exception exception)
        {
            _logger.LogError(exception, "Error submitting job via openAI connector.");
            return Attempt<TranslationJob>.Fail(exception);
        }
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

                var translationOptions = new OpenAITranslationOptions
                {
                    SourceLanguage = sourceLang,
                    TargetLanguage = targetLang,
                    IsHtml = isHtml,
                    Model = _model,
                    Prompt = _prompt,
                    SystemPrompt = _systemPrompt
                };

                var translated = await _openAiService.Translate(block, translationOptions);
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
        return translatedText.ToString().Trim();
    }


    public bool Active() => _openAiService.Enabled();

    public bool CanTranslate(TranslationJob job) => true;

    public void Reload()
    {
        _model = _configService.GetProviderSetting(this.Alias, "model", "gpt-3.5-turbo-instruct");
        _prompt = _configService.GetProviderSetting(this.Alias, "prompt", OpenAIConstants.DefaultPrompt);
        _systemPrompt = _configService.GetProviderSetting(this.Alias, "systemPrompt", OpenAIConstants.DefaultSystemPrompt);

        _split = _configService.GetProviderSetting(this.Alias, "split", false);
        _asHtml = _configService.GetProviderSetting(this.Alias, "asHtml", false);

        _aiServiceName = _configService.GetProviderSetting(Alias, "service", nameof(BetalgoOpenAiService));

        _openAiService = _openAIServiceFactory.GetActiveService();
    }



    public IEnumerable<string> GetTargetLanguages(string sourceLanguage)
        => Enumerable.Empty<string>();

    public Task<Attempt<TranslationJob>> Check(TranslationJob job)
        => Task.FromResult(Attempt.Succeed(job));

    public Task<Attempt<TranslationJob>> Cancel(TranslationJob job)
        => Task.FromResult(Attempt.Succeed(job));

    public Task<Attempt<TranslationJob>> Remove(TranslationJob job)
        => Task.FromResult(Attempt.Succeed(job));



    private TranslationHubClient GetTranslationClientHub()
    {
        return new TranslationHubClient(_hubContext, string.Empty);
    }
}
