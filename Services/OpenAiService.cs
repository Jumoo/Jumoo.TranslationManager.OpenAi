using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Azure.AI.OpenAI;

using HtmlAgilityPack;

using Jumoo.TranslationManager.OpenAi.Models;

using Lucene.Net.Util;

namespace Jumoo.TranslationManager.OpenAi.Services;


public class OpenAiService
{
    private readonly OpenAiSettings _settings;
    private CompletionsOptions _completionOptions;

    public OpenAiService()
    {
        _settings = new OpenAiSettings();
    }

    public void UpdateSettings(OpenAiSettings settings, CompletionsOptions options)
    {
        _settings.Key = settings.Key;
        _settings.Endpoint = settings.Endpoint;
        _settings.DeploymentId = settings.DeploymentId;

        _completionOptions = options;
    }

    public async Task<IEnumerable<string>> Translate(List<string> text, string sourceLang, string targetLang, bool isHtml)
    {
        var prompts = new List<string>();

        var textType = isHtml ? "html" : "text";

        foreach (var item in text)
        {
            prompts.Add($"translate this {sourceLang} {textType} into to {targetLang}\r\n\r\n{item}");
        }

        if (prompts.Any())
        {
            return await Translate(prompts);
        }

        return Enumerable.Empty<string>();
    }

    public async Task<string> Translate(string text, string sourceLang, string targetLang, bool isHtml)
    {
        var prompt = $"translate this {sourceLang} text into {targetLang}\r\n\r\n{text}";

        var completionOptions = DefaultCompleationOptions(_completionOptions);
        completionOptions.Prompts.Add(prompt);

        var client = new OpenAIClient(_settings.Key);

        var result = await client.GetCompletionsAsync(_settings.DeploymentId, completionOptions);

        return result.Value.Choices[0].Text;
    }

    private async Task<List<string>> Translate(IEnumerable<string> prompts)
    {
        var completionOptions = DefaultCompleationOptions(_completionOptions);
        completionOptions.Prompts.AddRange(prompts);

        var client = new OpenAIClient(_settings.Key);

        var result = await client.GetCompletionsAsync(_settings.DeploymentId, completionOptions);

        return result.Value.Choices.Select(x => x.Text).ToList();
    }

    private CompletionsOptions DefaultCompleationOptions(CompletionsOptions options)
        => new CompletionsOptions
        {
            MaxTokens = options?.MaxTokens ?? 500,
            Temperature = options?.Temperature ?? 0f,
            FrequencyPenalty = options?.FrequencyPenalty ?? 0.0f,
            PresencePenalty = options?.PresencePenalty ?? 0.0f,
            NucleusSamplingFactor = options?.NucleusSamplingFactor ?? 1
        };
}

