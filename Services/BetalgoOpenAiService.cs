﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Betalgo.Ranul.OpenAI;
using Betalgo.Ranul.OpenAI.Managers;
using Betalgo.Ranul.OpenAI.ObjectModels.RequestModels;
using Jumoo.TranslationManager.OpenAi.Models;

using Lucene.Net.Util;

using Microsoft.CodeAnalysis;
using Microsoft.Extensions.Logging;

namespace Jumoo.TranslationManager.OpenAi.Services;

internal class BetalgoOpenAiService : IOpenAiTranslationService
{
    private readonly ILogger<BetalgoOpenAiService> _logger;
    private readonly OpenAIConfigurationService _configurationService;

    public BetalgoOpenAiService(ILogger<BetalgoOpenAiService> logger,
        OpenAIConfigurationService configurationService)
    {
        _logger = logger;
        _configurationService = configurationService;
    }

    public bool Enabled()
        => string.IsNullOrEmpty(_configurationService.GetAuthOptions()?.Key) is false;

    private OpenAIService GetClient()
    {
        var authOptions = _configurationService.GetAuthOptions();
        return new OpenAIService(new OpenAIOptions
        {
            ApiKey = authOptions.Key,
        });
    }

    public async Task<IEnumerable<string>> Models()
    {
        var service = GetClient();
        var models = await service.Models.ListModel();
        return models.Models
            .Select(x => x.Id);
    }


    public async Task<IEnumerable<string>> Translate(List<string> text, OpenAITranslationOptions translationOptions)
    {
        if (OpenAIConstants.LegacyModels.Contains(translationOptions.Model)
            || OpenAIConstants.BaseModels.Contains(translationOptions.Model))
        {
            return await TranslateLegacy(text, translationOptions);
        }

        return await TranslateLatest(text, translationOptions);
    }

    private async Task<IEnumerable<string>> TranslateLatest(List<string> text, OpenAITranslationOptions translationOptions)
    {

        var request = LoadChatCompletionCreateRequestOptions();

        request.Messages = new List<ChatMessage> {
            ChatMessage.FromSystem(translationOptions.GetSystemPrompt())
            };
        request.Model = translationOptions.Model;

        var sourceContent = text
            .Where(x => x is not null)
            .Select(x => ChatMessage.FromUser(x)) ?? Enumerable.Empty<ChatMessage>();

        request.Messages.AddRange(sourceContent);

        var service = GetClient();

        var result = await service.ChatCompletion.CreateCompletion(request);

        if (!result.Successful)
            throw new InvalidOperationException(result.Error.Message);

        return result.Choices
            .Where(x => x.Message?.Content is not null)
            .Select(x => x.Message.Content);

    }

    private async Task<IEnumerable<string>> TranslateLegacy(List<string> text, OpenAITranslationOptions translationOptions)
    {
        var request = LoadCompletionCreateRequestOptions();
        request.Model = translationOptions.Model;
        request.PromptAsList = new List<string>();


        foreach (var item in text.Where(x => x is not null))
        {
            var promptText = translationOptions.GetPrompt(item);

            if (string.IsNullOrWhiteSpace(promptText) is true) continue;
            request.PromptAsList.Add(promptText);
        }

        var service = GetClient();
        var result = await service?.Completions?.CreateCompletion(request);

        if (!result.Successful)
            throw new InvalidOperationException(result.Error.Message);

        return result.Choices.Select(x => x.Text);
    }

    private CompletionCreateRequest LoadCompletionCreateRequestOptions()
    {
        return new CompletionCreateRequest
        {
            MaxTokens = _configurationService.GetConfigValue("maxTokens", 500),
            Temperature = _configurationService.GetConfigValue("temperature", 0f),
            FrequencyPenalty = _configurationService.GetConfigValue("frequencyPenalty", 0.0f),
            PresencePenalty = _configurationService.GetConfigValue("presencePenalty", 0.0f),
        };
    }

    private ChatCompletionCreateRequest LoadChatCompletionCreateRequestOptions()
    {
        return new ChatCompletionCreateRequest
        {
            MaxTokens = _configurationService.GetConfigValue("maxTokens", 500),
            Temperature = _configurationService.GetConfigValue("temperature", 0f),
            FrequencyPenalty = _configurationService.GetConfigValue("frequencyPenalty", 0.0f),
            PresencePenalty = _configurationService.GetConfigValue("presencePenalty", 0.0f),
        };
    }
}
