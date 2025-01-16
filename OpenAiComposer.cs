using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Jumoo.TranslationManager.Core.Boot;
using Jumoo.TranslationManager.Core.Models;

#if UMB_15_OR_GREATER
using Umbraco.Cms.Infrastructure.Manifest;
using Swashbuckle.AspNetCore.SwaggerGen;
using Microsoft.OpenApi.Models;
#else
using Jumoo.TranslationManager.OpenAi.Controllers;
#endif
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
using Microsoft.Extensions.Options;


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
#if UMB_14_OR_GREATER
        builder.Services.ConfigureOptions<ConfigureSwaggerGenOptions>();
        builder.Services.AddSingleton<IPackageManifestReader, PassthroughConnectorManifestReader>();
#else
        if (!builder.ManifestFilters().Has<OpenAiConnectorManifestFilter>())
            builder.ManifestFilters().Append<OpenAiConnectorManifestFilter>();

        builder.AddNotificationHandler<ServerVariablesParsingNotification, OpenAiServerVariablesParserHandler>();
#endif
    }
}
#if UMB_14_OR_GREATER
public class PassthroughConnectorManifestReader : IPackageManifestReader
{
    public Task<IEnumerable<PackageManifest>> ReadPackageManifestsAsync()
    {
        var manifest = new ConnectorPackageManifest
        {
            Name = OpenAiConnector.ConnectorName,
            Alias = OpenAiConnector.ConnectorAlias,
            Version = OpenAiConnector.ConnectorVersion,
            EntryPointScript = WebPath.Combine(OpenAiConnector.ConnectorPluginPath, "OpenAi.js")
        };

        return Task.FromResult(manifest.ToPackageManifest().AsEnumerableOfOne());
    }
}

internal class ConfigureSwaggerGenOptions : IConfigureOptions<SwaggerGenOptions>
{
    public void Configure(SwaggerGenOptions options)
    {
        options.SwaggerDoc(
            "tm-openai",
            new OpenApiInfo
            {
                Title = "OpenAi Translation API",
                Version = "Latest",
                Description = "it's OpenAi methods"
            });

        // sets the operation Ids to be the same as the action
        // so it loses all the v1... bits to the names.
        options.CustomOperationIds(e => $"{e.ActionDescriptor.RouteValues["action"]}");

    }
}



#else
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
#endif