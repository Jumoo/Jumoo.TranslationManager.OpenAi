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
        => new OpenAIAuthOptions
        {
            Key = _configService.GetProviderSetting(OpenAiConnector.ConnectorAlias, "key", string.Empty),
            Endpoint = _configService.GetProviderSetting(OpenAiConnector.ConnectorAlias, "endpoint", string.Empty)
        };


    public TObject GetConfigValue<TObject>(string key, TObject defaultValue)
        => _configService.GetProviderSetting(OpenAiConnector.ConnectorAlias, "key", defaultValue);
}
