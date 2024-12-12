import { ManifestTranslationConnector } from "@jumoo/translate";

export const connector: ManifestTranslationConnector = {
    type: "jumoo-tm-connector",
    alias: "jumoo-tm-openai-connector",
    name: "OpenAi Connector",
    meta: {
      icon: "jumoo-tm-openai-logo",
      label: "OpenAi connector",
      alias: "openAiConnector",
    },
  };  