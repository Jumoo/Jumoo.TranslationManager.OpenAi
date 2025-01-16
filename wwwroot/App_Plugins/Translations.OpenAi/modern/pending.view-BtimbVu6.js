import { TranslationConnectorPendingElementBase as g } from "@jumoo/translate";
import { html as p, css as m, customElement as f } from "@umbraco-cms/backoffice/external/lit";
var x = Object.defineProperty, P = Object.getOwnPropertyDescriptor, h = (a, i, s, t) => {
  for (var e = t > 1 ? void 0 : t ? P(i, s) : i, n = a.length - 1, l; n >= 0; n--)
    (l = a[n]) && (e = (t ? l(i, s, e) : l(e)) || e);
  return t && e && x(i, s, e), e;
};
let v = class extends g {
  render() {
    var a, i, s, t, e, n, l, c, d, o, r, u;
    return p`<uui-box>
      <div class="setting">
        <div class="title">Model</div>
        <div class="value">
            ${((i = (a = this.connector) == null ? void 0 : a.settings) == null ? void 0 : i.model) ?? "text-davinci-003"}
        </div>
      </div>
      <div class="setting">
        <div class="title">Max Tokens</div>
        <div class="value">
            ${((t = (s = this.connector) == null ? void 0 : s.settings) == null ? void 0 : t.maxTokens) ?? "500"}
        </div>
      </div>
      <div class="setting">
        <div class="title">Temperature</div>
        <div class="value">
            ${((n = (e = this.connector) == null ? void 0 : e.settings) == null ? void 0 : n.temperature) ?? "0"}
        </div>
      </div>
      <div class="setting">
        <div class="title">Frequency Penalty</div>
        <div class="value">
            ${((c = (l = this.connector) == null ? void 0 : l.settings) == null ? void 0 : c.frequencyPenalty) ?? "0"}
        </div>
      </div>
      <div class="setting">
        <div class="title">Presence Penalty</div>
        <div class="value">
            ${((o = (d = this.connector) == null ? void 0 : d.settings) == null ? void 0 : o.presencePenalty) ?? "0"}
        </div>
      </div>
      <div class="setting">
        <div class="title">Nucleus Sampling</div>
        <div class="value">
            ${((u = (r = this.connector) == null ? void 0 : r.settings) == null ? void 0 : u.nucleusSampling) ?? "1"}
        </div>
      </div>
    </uui-box>`;
  }
};
v.styles = m`
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
v = h([
  f("jumoo-openai-pending")
], v);
const $ = v;
export {
  v as TranslationOpenAiConnectorPendingElement,
  $ as default
};
//# sourceMappingURL=pending.view-BtimbVu6.js.map
