import { UMB_AUTH_CONTEXT as c } from "@umbraco-cms/backoffice/auth";
const a = {
  type: "jumoo-tm-connector",
  alias: "jumoo-tm-openai-connector",
  name: "OpenAi Connector",
  meta: {
    icon: "jumoo-tm-openai-logo",
    label: "OpenAi connector",
    alias: "openAiConnector"
  }
}, m = {
  type: "jumoo-tm-connector-config",
  alias: "jumoo-openai-config",
  name: "OpenAi Connector Config",
  elementName: "jumoo-openai-config",
  js: () => import("./config.view-CA3UiS-q.js")
}, p = {
  type: "jumoo-tm-connector-pending",
  alias: "jumoo-openai-pending",
  name: "OpenAi Connector Pending",
  elementName: "jumoo-openai-pending",
  js: () => import("./pending.view-BtimbVu6.js")
}, r = [m, p], f = {
  type: "icons",
  alias: "jumoo.tm.icons.openai",
  name: "Translation Manager OpenAi Icon",
  js: () => import("./icons-24jZE_A9.js")
}, A = [f];
class s {
  constructor() {
    this._fns = [];
  }
  eject(n) {
    const o = this._fns.indexOf(n);
    o !== -1 && (this._fns = [...this._fns.slice(0, o), ...this._fns.slice(o + 1)]);
  }
  use(n) {
    this._fns = [...this._fns, n];
  }
}
const t = {
  BASE: "",
  CREDENTIALS: "include",
  ENCODE_PATH: void 0,
  HEADERS: void 0,
  PASSWORD: void 0,
  TOKEN: void 0,
  USERNAME: void 0,
  VERSION: "Latest",
  WITH_CREDENTIALS: !1,
  interceptors: {
    request: new s(),
    response: new s()
  }
}, l = (i, n) => {
  n.registerMany([
    a,
    ...A,
    ...r
    //...localizations
  ]), i.consumeContext(c, (o) => {
    const e = o.getOpenApiConfiguration();
    t.TOKEN = e.token, t.BASE = e.base, t.WITH_CREDENTIALS = e.withCredentials;
  });
};
export {
  t as O,
  l as o
};
//# sourceMappingURL=index-CPgL5ne9.js.map
