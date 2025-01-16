#if UMB_14_OR_GREATER
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Cms.Web.Common.Routing;
using Umbraco.Cms.Api.Common.Attributes;
using Jumoo.TranslationManager.OpenAi.Services;

namespace Jumoo.TranslationManager.OpenAi.Controllers
{
    [ApiController]
    [BackOfficeRoute("tm-openai/api/v{version:apiVersion}")]
    [Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
    [MapToApi("tm-openai")]
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "OpenAiTranslate")]
    public class OpenAiManagementController
    {
        private OpenAIServiceFactory _openAIServiceFactory;

        public OpenAiManagementController(OpenAIServiceFactory openAIServiceFactory)
        {
            _openAIServiceFactory = openAIServiceFactory;
        }

        [HttpGet("Models")]
        [ProducesResponseType(200)]
        public async Task<IEnumerable<string>> Models()
            => await _openAIServiceFactory.GetActiveService().Models();

        [HttpGet("Services")]
        [ProducesResponseType(200)]
        public IEnumerable<string> Services()
            => _openAIServiceFactory.GetServices()
                .Select(x => x.GetType().Name);
    }
}
#endif