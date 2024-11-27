#if UMB_13_OR_LESS
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Jumoo.TranslationManager.OpenAi.Services;

using Microsoft.AspNetCore.Mvc;

using Umbraco.Cms.Web.BackOffice.Controllers;
using Umbraco.Cms.Web.Common.Attributes;

namespace Jumoo.TranslationManager.OpenAi.Controllers;

[PluginController("translate")]
public class OpenAiController : UmbracoAuthorizedApiController
{
    private OpenAIServiceFactory _openAIServiceFactory;

    public OpenAiController(OpenAIServiceFactory openAIServiceFactory)
    {
        _openAIServiceFactory = openAIServiceFactory;
    }

    [HttpGet]
    public bool GetApi() => true;

    [HttpGet]
    public async Task<IEnumerable<string>> Models()
        => await _openAIServiceFactory.GetActiveService().Models();

    [HttpGet]
    public IEnumerable<string> Services()
        => _openAIServiceFactory.GetServices()
            .Select(x => x.GetType().Name);
}
#endif