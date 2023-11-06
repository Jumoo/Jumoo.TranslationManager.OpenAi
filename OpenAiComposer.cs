using System.Collections.Generic;
using System.Linq;

using Jumoo.TranslationManager.Core.Boot;
using Jumoo.TranslationManager.OpenAi.Controllers;
using Jumoo.TranslationManager.OpenAi.Services;

using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Manifest;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Routing;
using Umbraco.Extensions;

namespace Jumoo.TranslationManager.OpenAi;

/// <summary>
///  we need to boot this before the core loads the controllers. 
/// </summary>
[ComposeBefore(typeof(TranslationComposer))]
internal class OpenAiComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.AddSingleton<OpenAIConfigurationService>();

        builder.Services.AddSingleton<IOpenAiTranslationService, AzureOpenAiService>();
        builder.Services.AddSingleton<IOpenAiTranslationService, BetalgoOpenAiService>();

        // so we can swap services out. 
        builder.Services.AddSingleton<OpenAIServiceFactory>();

        if (!builder.ManifestFilters().Has<OpenAiConnectorManifestFilter>())
            builder.ManifestFilters().Append<OpenAiConnectorManifestFilter>();

        builder.AddNotificationHandler<ServerVariablesParsingNotification, OpenAiServerVariablesParserHandler>();
    }
}

internal class OpenAiConnectorManifestFilter : IManifestFilter
{
    public void Filter(List<PackageManifest> manifests)
    {
        if (manifests.Any(x => x.PackageName == OpenAiConnector.ConnectorName))
            return;

        manifests.Add(new PackageManifest
        {
            PackageName = OpenAiConnector.ConnectorName,
            AllowPackageTelemetry = true,
            Version = OpenAiConnector.ConnectorVersion,
            Scripts = new[]
            {
                WebPath.Combine(OpenAiConnector.ConnectorPluginPath, "config.controller.js"),
                WebPath.Combine(OpenAiConnector.ConnectorPluginPath, "openAi.service.js")
            }
        });
    }
}

public class OpenAiServerVariablesParserHandler :
    INotificationHandler<ServerVariablesParsingNotification>
{
    private readonly LinkGenerator _linkGenerator;

    public OpenAiServerVariablesParserHandler(LinkGenerator linkGenerator)
    {
        _linkGenerator = linkGenerator;
    }

    public void Handle(ServerVariablesParsingNotification notification)
    {
        notification.ServerVariables.Add("openAiTranslations", new Dictionary<string, object>
        {
            { "service", _linkGenerator.GetUmbracoApiServiceBaseUrl<OpenAiController>(x => x.GetApi()) }
        });
    }
}
