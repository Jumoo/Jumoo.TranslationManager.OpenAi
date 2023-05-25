using System.Collections.Generic;
using System.Linq;

using Jumoo.TranslationManager.OpenAi.Services;

using Microsoft.Extensions.DependencyInjection;

using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Manifest;
using Umbraco.Cms.Core.Routing;

namespace Jumoo.TranslationManager.OpenAi;
internal class OpenAiComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.AddSingleton<OpenAiService>();

        if (!builder.ManifestFilters().Has<OpenAiConnectorManifestFilter>())
            builder.ManifestFilters().Append<OpenAiConnectorManifestFilter>();
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
                WebPath.Combine(OpenAiConnector.ConnectorPluginPath, "config.controller.js")
            }
        });
    }
}
