namespace Jumoo.TranslationManager.OpenAi.Services
{
    internal class ChatCompletionsOptions
    {
        public int MaxTokens { get; set; }
        public float Temperature { get; set; }
        public float FrequencyPenalty { get; set; }
        public float PresencePenalty { get; set; }
        public int NucleusSamplingFactor { get; set; }
    }
}