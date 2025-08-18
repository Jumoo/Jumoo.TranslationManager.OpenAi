using Azure.AI.OpenAI;

using Jumoo.TranslationManager.OpenAi.Models;

using Microsoft.Extensions.Logging;
using OpenAI.Chat;
using System;
using System.ClientModel;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Umbraco.Extensions;

namespace Jumoo.TranslationManager.OpenAi.Services;


public class AzureOpenAiService : IOpenAiTranslationService
{
    // private ChatCompletionsOptions _completionOptions;
    private ILogger<AzureOpenAiService> _logger;
    private readonly OpenAIConfigurationService _openAiConfigService;


    public AzureOpenAiService(
        ILogger<AzureOpenAiService> logger,
        OpenAIConfigurationService openAiConfigService)
    {
        _logger = logger;
        _openAiConfigService = openAiConfigService;
    }

    public bool Enabled()
        => string.IsNullOrEmpty(_openAiConfigService.GetAuthOptions()?.Key) is false;

    private ChatClient GetClient(string model)
    {
        var authOptions = _openAiConfigService.GetAuthOptions();

        AzureOpenAIClient azureClient = new(
            new Uri(authOptions.Endpoint),
            new ApiKeyCredential(authOptions.Key));
        return azureClient.GetChatClient(model);
    }

    private bool UsingOpenAiUrl(string url)
        => string.IsNullOrWhiteSpace(url) || url.InvariantContains("openai.com");

    public async Task<IEnumerable<string>> Models()
    {
        // var client = GetClient();
        return await Task.FromResult(Enumerable.Empty<string>());
    }


    public async Task<IEnumerable<string>> Translate(List<string> text, OpenAITranslationOptions translationOptions)
    {
        var textType = translationOptions.IsHtml ? "html" : "text";
        return await Translate(translationOptions, text, textType);
    }

    private async Task<List<string>> Translate(OpenAITranslationOptions translationOptions, List<string> text, string textType)
    {
        if (IsLegacyModel(translationOptions.Model))
        {
            var prompts = new List<string>();

            foreach (var item in text)
            {
                var promptText = translationOptions.GetPrompt(item);
                prompts.Add(promptText);
            }

            return await TranslateLegacy(prompts, translationOptions);
        }

        return await TranslateLatest(translationOptions, text, textType);
    }

    #region legacy / base translation 

    private async Task<List<string>> TranslateLegacy(IEnumerable<string> prompts, OpenAITranslationOptions translationOptions)
    {
        var completionOptions = DefaultLegacyCompletionOptions(LoadCompletionsOptions());

        var chatMessages = prompts.Select(x => ChatMessage.CreateUserMessage(x));

        var client = GetClient(translationOptions.Model);

        var result = await client.CompleteChatAsync(chatMessages, completionOptions);

        return result.Value.Content.Select(x => x.Text).ToList();
    }

    private ChatCompletionOptions DefaultLegacyCompletionOptions(ChatCompletionsOptions options)
        => new ChatCompletionOptions
        {
            MaxOutputTokenCount = options?.MaxTokens ?? 500,
            Temperature = options?.Temperature ?? 0f,
            FrequencyPenalty = options?.FrequencyPenalty ?? 0.0f,
            PresencePenalty = options?.PresencePenalty ?? 0.0f,
            TopP = options?.NucleusSamplingFactor ?? 1
        };

    #endregion

    #region Latest models 

    private async Task<List<string>> TranslateLatest(OpenAITranslationOptions translationOptions, List<string> text, string textType)
    {
        var chatOptions = DefaultChatCompletionOptions(LoadCompletionsOptions());

        var messages = new List<ChatMessage>();

        messages.Add(ChatMessage.CreateSystemMessage(translationOptions.GetSystemPrompt()));
        messages.AddRange(text.Select(content => ChatMessage.CreateUserMessage(content)));


        var client = GetClient(translationOptions.Model);

        var result = await client.CompleteChatAsync(messages,chatOptions);

        return result.Value.Content.Select(x => x.Text).ToList();
    }

    private ChatCompletionsOptions LoadCompletionsOptions()
    {
        return new ChatCompletionsOptions
        {
            MaxTokens = _openAiConfigService.GetConfigValue("maxTokens", 500),
            Temperature = _openAiConfigService.GetConfigValue("temperature", 0f),
            FrequencyPenalty = _openAiConfigService.GetConfigValue("frequencyPenalty", 0.0f),
            PresencePenalty = _openAiConfigService.GetConfigValue("presencePenalty", 0.0f),
            NucleusSamplingFactor = _openAiConfigService.GetConfigValue("nucleusSamplingFactor", 1),
        };
    }

    private ChatCompletionOptions DefaultChatCompletionOptions(ChatCompletionsOptions options)
    {
        return new ChatCompletionOptions
        {
            FrequencyPenalty = options?.FrequencyPenalty ?? 0.0f,
            MaxOutputTokenCount = options?.MaxTokens ?? 500,
            Temperature = options?.Temperature ?? 0f,
            TopP = options?.NucleusSamplingFactor ?? -1,
            PresencePenalty = options?.PresencePenalty ?? -0.0f,
        };
    }
    #endregion

    private bool IsLegacyModel(string model)
        => OpenAIConstants.BaseModels.InvariantContains(model) ||
            OpenAIConstants.LegacyModels.InvariantContains(model);


}

