import { TranslationConnectorPendingElementBase as d } from "@jumoo/translate";
import { html as c, css as o, customElement as r } from "@umbraco-cms/backoffice/external/lit";
var u = Object.defineProperty, p = Object.getOwnPropertyDescriptor, m = (e, i, s, a) => {
  for (var l = a > 1 ? void 0 : a ? p(i, s) : i, n = e.length - 1, v; n >= 0; n--)
    (v = e[n]) && (l = (a ? v(i, s, l) : v(l)) || l);
  return a && l && u(i, s, l), l;
};
let t = class extends d {
  render() {
    var i;
    const e = (i = this.connector) == null ? void 0 : i.settings;
    return c`<jumoo-tm-ui-box headline="Settings">
      <div class="setting">
        <div class="title">Model</div>
        <div class="value">${(e == null ? void 0 : e.model) ?? "text-davinci-003"}</div>
      </div>
      <div class="setting">
        <div class="title">Max Tokens</div>
        <div class="value">${(e == null ? void 0 : e.maxTokens) ?? "500"}</div>
      </div>
      <div class="setting">
        <div class="title">Temperature</div>
        <div class="value">${(e == null ? void 0 : e.temperature) ?? "0"}</div>
      </div>
      <div class="setting">
        <div class="title">Frequency Penalty</div>
        <div class="value">${(e == null ? void 0 : e.frequencyPenalty) ?? "0"}</div>
      </div>
      <div class="setting">
        <div class="title">Presence Penalty</div>
        <div class="value">${(e == null ? void 0 : e.presencePenalty) ?? "0"}</div>
      </div>
      <div class="setting">
        <div class="title">Nucleus Sampling</div>
        <div class="value">${(e == null ? void 0 : e.nucleusSampling) ?? "1"}</div>
      </div>
    </jumoo-tm-ui-box>`;
  }
};
t.styles = o`
    uui-box {
      --uui-box-default-padding: var(--uui-size-space-2) var(--uui-size-space-5);
    }

    .setting {
      display: flex;
      gap: var(--uui-size-space-2);
      margin: var(--uui-size-space-5) 0;
    }

    .title {
      font-weight: bold;
      min-width: 100px;
      text-align: right;
    }

    .title::after {
      content: ":";
    }

    .value {
      font-style: italic;
    }
  `;
t = m([
  r("jumoo-openai-pending")
], t);
const P = t;
export {
  t as TranslationOpenAiConnectorPendingElement,
  P as default
};
//# sourceMappingURL=pending.view-oDDo5Ze7.js.map
