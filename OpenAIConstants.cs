using Jumoo.TranslationManager.Utilities;

using Org.BouncyCastle.Bcpg.Sig;

using System;

namespace Jumoo.TranslationManager.OpenAi;

public static class OpenAIConstants
{
    public const string DefaultEndpoint = "https://api.openai.com/v1/completions";
    public const string DefaultPrompt = "translate this {sourceLang} {textType} into to {targetLang}\n\n{text}\n";
    public const string DefaultSystemPrompt = "You will be provided with sentences in {sourceLang}, and your task is to translate it into {targetLang}, if you can not translate something return the value you were given.";
    public const string DefaultModel = "gpt-4o";

#if UMB_14_OR_GREATER
    public const string ConnectorPluginPath = "/App_Plugins/Translations.OpenAi/modern/";
    public const string ConfigViewPath = "jumoo-openai-config";
    public const string PendingViewPath = "jumoo-openai-pending";
#else
    public const string ConnectorPluginPath = "/App_Plugins/Translations.OpenAi/legacy/";
    public static string ConfigViewPath = TranslateUriUtility.ToAbsolute(ConnectorPluginPath + "config.html");
    public static string PendingViewPath = TranslateUriUtility.ToAbsolute(ConnectorPluginPath + "pending.html");
#endif


    public static string[] BaseModels = new[] {
        "babbage-002, davinci-002"
    };

    public static string[] LegacyModels = new[] {
        "gpt-3.5-turbo-instruct",
        "babbage-002",
        "text-davinci-003",
        "text-davinci-002",
        "davinci",
        "curie",
        "babbage",
        "ada" };
}
