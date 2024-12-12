const o = {
  type: "jumoo-tm-connector",
  alias: "jumoo-tm-openai-connector",
  name: "OpenAi Connector",
  meta: {
    icon: "jumoo-tm-openai-logo",
    label: "OpenAi connector",
    alias: "openAiConnector"
  }
}, e = {
  type: "jumoo-tm-connector-config",
  alias: "jumoo-openai-config",
  name: "OpenAi Connector Config",
  elementName: "jumoo-openai-config",
  js: () => import("./config.view-D0AuPmX5.js")
}, t = {
  type: "jumoo-tm-connector-pending",
  alias: "jumoo-openai-pending",
  name: "OpenAi Connector Pending",
  elementName: "jumoo-openai-pending",
  js: () => import("./pending.view-DEs6FW9x.js")
}, i = [e, t], c = {
  type: "icons",
  alias: "jumoo.tm.icons.openai",
  name: "Translation Manager OpenAi Icon",
  js: () => import("./icons-24jZE_A9.js")
}, a = [c], s = (m, n) => {
  n.registerMany([
    o,
    ...a,
    ...i
    //...localizations
  ]);
};
export {
  s as onInit
};
//# sourceMappingURL=OpenAi.js.map
