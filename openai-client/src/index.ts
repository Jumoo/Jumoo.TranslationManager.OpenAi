import { UmbEntryPointOnInit } from "@umbraco-cms/backoffice/extension-api";
import { connector } from "./connector";

import { manifests as views } from "./views/manifest";
import { manifests as icons } from './icons/manifest.js';

export const onInit: UmbEntryPointOnInit = (_host, extensionRegistry) => {
    extensionRegistry.registerMany([connector,  
      ...icons,
      ...views, 
      //...localizations
      ]);
}