using System.Collections.Generic;
using System.Linq;

using Jumoo.TranslationManager.Core.Configuration;

using Umbraco.Extensions;

namespace Jumoo.TranslationManager.OpenAi.Services;
public class OpenAIServiceFactory
{
    public readonly IEnumerable<IOpenAiTranslationService> _services;
    public readonly TranslationConfigService _configService;

    public OpenAIServiceFactory(IEnumerable<IOpenAiTranslationService> services, TranslationConfigService configService)
    {
        _services = services;
        _configService = configService;
    }

    public IOpenAiTranslationService GetActiveService()
    {
        var serviceName = _configService.GetProviderSetting(OpenAiConnector.ConnectorAlias, "service", nameof(BetalgoOpenAiService));

        return _services.FirstOrDefault(x => x.GetType().Name.InvariantContains(serviceName))
            ?? _services.FirstOrDefault(x => x.GetType() == typeof(BetalgoOpenAiService));
    }

    public IEnumerable<IOpenAiTranslationService> GetServices()
        => _services;
}
