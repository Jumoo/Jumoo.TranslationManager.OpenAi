using Jumoo.TranslationManager.Core.Configuration;
using Jumoo.TranslationManager.OpenAi.Models;

namespace Jumoo.TranslationManager.OpenAi.Services;
public class OpenAIConfigurationService
{
    private TranslationConfigService _configService;

    public OpenAIConfigurationService(TranslationConfigService configService)
    {
        _configService = configService;
    }

    public OpenAIAuthOptions GetAuthOptions()
    {
        var key = _configService.GetProviderSetting(OpenAiConnector.ConnectorAlias, "ApiKey", string.Empty);
        if (string.IsNullOrEmpty(key))
        {
            key = _configService.GetProviderSetting(OpenAiConnector.ConnectorAlias, "apiKey", string.Empty);
        }
        return new OpenAIAuthOptions
        {
            Key = key,
            Endpoint = _configService.GetProviderSetting(OpenAiConnector.ConnectorAlias, "endpoint", string.Empty)
        };
    }


    public TObject GetConfigValue<TObject>(string key, TObject defaultValue)
        => _configService.GetProviderSetting(OpenAiConnector.ConnectorAlias, "ApiKey", defaultValue);
}
