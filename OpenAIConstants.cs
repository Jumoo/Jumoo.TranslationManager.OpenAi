namespace Jumoo.TranslationManager.OpenAi;

public static class OpenAIConstants
{
    public const string DefaultEndpoint = "https://api.openai.com/v1/completions";
    public const string DefaultPrompt = "translate this {sourceLang} {textType} into to {targetLang}\n\n{text}\n";
    public const string DefaultSystemPrompt = "You will be provided with sentences in {sourceLang}, and your task is to translate it into {targetLang}";
    public const string DefaultModel = "davinci-002";


    public static string[] BaseModels = new[] {
        "babbage-002, davinci-002"
    };

    public static string[] LegacyModels = new[] {
        "text-davinci-003",
        "text-davinci-002",
        "davinci",
        "curie",
        "babbage",
        "ada" };
}
