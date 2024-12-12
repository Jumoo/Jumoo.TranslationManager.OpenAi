import {
    ManifestTranslationConnectorConfig,
    ManifestTranslationConnectorPending,
  } from "@jumoo/translate";
  
  const connectorConfig: ManifestTranslationConnectorConfig = {
    type: "jumoo-tm-connector-config",
    alias: "jumoo-openai-config",
    name: "OpenAi Connector Config",
    elementName: "jumoo-openai-config",
    js: () => import("./config.view.js"),
  };
  
  const connectorPending: ManifestTranslationConnectorPending = {
    type: "jumoo-tm-connector-pending",
    alias: "jumoo-openai-pending",
    name: "OpenAi Connector Pending",
    elementName: "jumoo-openai-pending",
    js: () => import("./pending.view.js"),
  };
  
  export const manifests = [connectorConfig, connectorPending];