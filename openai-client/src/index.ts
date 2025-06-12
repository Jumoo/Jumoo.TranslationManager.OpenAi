import { UmbEntryPointOnInit } from "@umbraco-cms/backoffice/extension-api";
import { connector } from "./connector";

import { manifests as views } from "./views/manifest";
import { manifests as icons } from "./icons/manifest.js";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { client } from "./api/index.js";

export const onInit: UmbEntryPointOnInit = (_host, extensionRegistry) => {
  extensionRegistry.registerMany([
    connector,
    ...icons,
    ...views,
    //...localizations
  ]);
  _host.consumeContext(UMB_AUTH_CONTEXT, (_auth) => {
    if (!_auth) return;
    const config = _auth.getOpenApiConfiguration();

    client.setConfig({
      baseUrl: config.base,
      credentials: config.credentials,
    });

    client.interceptors.request.use(async (request, _options) => {
      const token = await _auth.getLatestToken();
      request.headers.set("Authorization", `Bearer ${token}`);
      return request;
    });
  });
};
