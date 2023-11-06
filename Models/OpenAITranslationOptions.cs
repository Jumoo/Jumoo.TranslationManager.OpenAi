using System.Transactions;

namespace Jumoo.TranslationManager.OpenAi.Models;

public class OpenAITranslationOptions
{
    public string SourceLanguage { get; set; }
    public string TargetLanguage { get; set; }
    public bool IsHtml { get; set; }

    public string Model { get; set; }

    public string Prompt { get; set; }

    public string SystemPrompt { get; set; }
}

public static class OpenAITranslationOptionsExtensions
{
    public static string GetPrompt(this OpenAITranslationOptions options,
        string text)
        => options.Prompt.Replace("{sourceLang}", options.SourceLanguage)
            .Replace("{targetLang}", options.TargetLanguage)
            .Replace("{textType}", options.IsHtml ? "html" : "text")
            .Replace("{text}", text);

    public static string GetSystemPrompt(this OpenAITranslationOptions options)
        => options.SystemPrompt.Replace("{sourceLang}", options.SourceLanguage)
            .Replace("{targetLang}", options.TargetLanguage)
            .Replace("{textType}", options.IsHtml ? "html" : "text");


}




