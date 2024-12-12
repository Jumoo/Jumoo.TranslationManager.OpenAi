import { TranslationConnectorPendingElementBase as a } from "@jumoo/translate";
import { html as i, customElement as m } from "@umbraco-cms/backoffice/external/lit";
var c = Object.defineProperty, f = Object.getOwnPropertyDescriptor, P = (p, n, o, r) => {
  for (var e = r > 1 ? void 0 : r ? f(n, o) : n, t = p.length - 1, s; t >= 0; t--)
    (s = p[t]) && (e = (r ? s(n, o, e) : s(e)) || e);
  return r && e && c(n, o, e), e;
};
let l = class extends a {
  render() {
    return i`<p>other words</p>`;
  }
};
l = P([
  m("jumoo-openai-pending")
], l);
const v = l;
export {
  l as TranslationOpenAiConnectorPendingElement,
  v as default
};
//# sourceMappingURL=pending.view-DEs6FW9x.js.map
