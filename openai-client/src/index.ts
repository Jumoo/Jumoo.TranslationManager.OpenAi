import { UmbEntryPointOnInit } from "@umbraco-cms/backoffice/extension-api";
import { connector } from "./connector";

import { manifests as views } from "./views/manifest";
import { manifests as icons } from './icons/manifest.js';
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { OpenAPI } from "./api/index.js";

export const onInit: UmbEntryPointOnInit = (_host, extensionRegistry) => {
    extensionRegistry.registerMany([connector,  
      ...icons,
      ...views, 
      //...localizations
      ]);
      _host.consumeContext(UMB_AUTH_CONTEXT, (_auth) => {
        const umbOpenApi = _auth.getOpenApiConfiguration();
        OpenAPI.TOKEN = umbOpenApi.token;
        OpenAPI.BASE = umbOpenApi.base;
        OpenAPI.WITH_CREDENTIALS = umbOpenApi.withCredentials;
      });
}