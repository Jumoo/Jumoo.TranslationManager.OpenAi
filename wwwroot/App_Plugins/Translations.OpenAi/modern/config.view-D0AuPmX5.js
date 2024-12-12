import { TranslationConnectorConfigElementBase as d, JUMOO_TM_CONNECTOR_SETTINGS_CONTEXT as y } from "@jumoo/translate";
import { html as i, css as c, customElement as m } from "@umbraco-cms/backoffice/external/lit";
var h = Object.defineProperty, b = Object.getOwnPropertyDescriptor, p = (e) => {
  throw TypeError(e);
}, v = (e, t, r, o) => {
  for (var n = o > 1 ? void 0 : o ? b(t, r) : t, a = e.length - 1, l; a >= 0; a--)
    (l = e[a]) && (n = (o ? l(t, r, n) : l(n)) || n);
  return o && n && h(t, r, n), n;
}, g = (e, t, r) => t.has(e) || p("Cannot " + r), x = (e, t, r) => t.has(e) ? p("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), f = (e, t, r, o) => (g(e, t, "write to private field"), t.set(e, r), r), s;
let u = class extends d {
  constructor() {
    super(), x(this, s), this.consumeContext(y, (e) => {
      f(this, s, e);
    });
  }
  render() {
    return i`
          <umb-body-layout>
            <div class="layout">
              <div class="left">
                <uui-box>
                    <p>
                        In order to use the OpenAi Translation API, you will need to
                        supply an API Key.
                    </p>
                </uui-box>
                <uui-box headline="OpenAi Translatation Api">
                    ${this.renderApiKey()} ${this.renderThrottle()}
                    ${this.renderSplitOption()} ${this.renderSendAsHtmlOption()}
                </uui-box>
                <uui-box>
                  ${this.renderService()}
                  ${this.renderModel()}${this.renderMaxTokens()}
                  ${this.renderTemperature()}${this.renderFrequencyPenalty()}
                  ${this.renderPresencePenalty()}${this.renderNucleusSamplingFactor()}
                </uui-box>
              </div>
            </div>
          </umb-body-layout>`;
  }
  renderApiKey() {
    var e;
    return i` <umb-property-layout
            label="Api Key"
            description="OpenAi Translation Api Key"
            ><div slot="editor">
              <uui-input
                id="apiKey"
                label="ApiKey"
                .value=${((e = this.settings) == null ? void 0 : e.apiKey) ?? ""}
                @change=${this.onUpdateOption}
              ></uui-input>
            </div>
          </umb-property-layout>`;
  }
  renderThrottle() {
    var t;
    const e = ((t = this.settings) == null ? void 0 : t.throttle) || 250;
    return i` <umb-property-layout
            label="Throttle"
            description="Number of milliseconds to wait between calls (To Avoid API Throttling)"
          >
            <div slot="editor">
              <uui-input
                id="throttle"
                value=${e}
                label="throttle (ms)"
                @change=${this.onUpdateOption}
              ></uui-input>
            </div>
          </umb-property-layout>`;
  }
  renderSplitOption() {
    var e;
    return i` <umb-property-layout
            label="Split"
            description="Split any HTML before sending to translation"
          >
            <div slot="editor">
              <uui-checkbox
                label="Split Html"
                id="split"
                .checked=${((e = this.settings) == null ? void 0 : e.split) ?? !1}
                @change=${this.onUpdateOption}
              >
              </uui-checkbox>
            </div>
          </umb-property-layout>`;
  }
  renderSendAsHtmlOption() {
    var e;
    return i` <umb-property-layout
            label="Send as HTML"
            description="Make sure html elments are marked as html when sent to translation"
          >
            <div slot="editor">
              <uui-checkbox
                id="asHtml"
                label="Send as HTML"
                .checked=${((e = this.settings) == null ? void 0 : e.asHtml) ?? !1}
                @change=${this.onUpdateOption}
              >
              </uui-checkbox>
            </div>
          </umb-property-layout>`;
  }
  renderService() {
    return i`<umb-property-layout
          label="OpenAi Library"
          description="Choose which API Library to use when sending translations">
            <div slot="editor">
             <uui-select
             placeholder="Select an option"
             .options=${[
      { name: "Carrot", value: "orange" },
      { name: "Cucumber", value: "green" },
      { name: "Aubergine", value: "purple" },
      { name: "Blueberry", value: "Blue" },
      { name: "Banana", value: "yellow" },
      { name: "Strawberry", value: "red" }
    ]}></uui-select>
            </div></umb-property-layout>`;
  }
  renderModel() {
    var e;
    return i`<umb-property-layout
          label="Model"
          description="OpenAi Model to use to translation">
            <div slot="editor">
              <uui-input
              id="model"
              label="Model"
              value=${((e = this.settings) == null ? void 0 : e.model) ?? "text-davinci-003"}>
              </uui-input>
            </div>
          </umb-property-layout>`;
  }
  renderMaxTokens() {
    var e;
    return i`<umb-property-layout
          label="Max Tokens"
          description="The maximum number of tokens to generate in the completion.">
            <div slot="editor">
              <uui-input
              id="maxTokens"
              label="MaxTokens"
              type="number"
              value=${((e = this.settings) == null ? void 0 : e.maxTokens) ?? 500}>
              </uui-input>
            </div>
          </umb-property-layout>`;
  }
  renderTemperature() {
    var e;
    return i`<umb-property-layout
          label="Temperature"
          description="Sampling temperature">
            <div slot="editor">
              <uui-input
              id="temperature"
              label="Temperature"
              type="number"
              step="0.1"
              value=${((e = this.settings) == null ? void 0 : e.temperature) ?? 0}></uui-input>
            </div>
          </umb-property-layout>`;
  }
  renderFrequencyPenalty() {
    var e;
    return i`<umb-property-layout
          label="Frequency Penalty"
          description="Positive values penalize new tokens based on their existing frequency in the text so far">
            <div slot="editor">
              <uui-input
              id="frequencyPenalty"
              label="FrequencyPenalty"
              type="number"
              step="0.1"
              value=${((e = this.settings) == null ? void 0 : e.frequencyPenalty) ?? 0}></uui-input>
            </div>
          </umb-property-layout>`;
  }
  renderPresencePenalty() {
    var e;
    return i`<umb-property-layout
          label="Presence Penalty"
          description="Positive values penalize new tokens based on their existing frequency in the text so far">
            <div slot="editor">
              <uui-input
              id="presencePenalty"
              label="PresencePenalty"
              type="number"
              step="0.1"
              value=${((e = this.settings) == null ? void 0 : e.presencePenalty) ?? 0}></uui-input>
            </div>
          </umb-property-layout>`;
  }
  renderNucleusSamplingFactor() {
    var e;
    return i`<umb-property-layout
          label="Nucleus sampling"
          description=".">
            <div slot="editor">
              <uui-input
              id="nucleusSampling"
              label="NucleusSampling"
              type="number"
              value=${((e = this.settings) == null ? void 0 : e.nucleusSampling) ?? 1}></uui-input>
            </div>
          </umb-property-layout>`;
  }
};
s = /* @__PURE__ */ new WeakMap();
u.styles = c`
        .layout {
            display: flex;
            gap: var(--uui-size-space-5);
        }

        .left, .right {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            gap: var(--uui-size-space-5);
        }
        
        .right {
          flex-basis: 30%;
          max-width: 325px;
        }

        @media screen and (max-width: 1280px) {
          .layout{
            flex-direction: column;
          }
          .layout > div{
            max-width: 100%;
          }
        }

        uui-input,
        uui-select {
            width: 100%;
        }
    `;
u = v([
  m("jumoo-openai-config")
], u);
const P = u;
export {
  u as TranslationOpenAiConnectorConfigElement,
  P as default
};
//# sourceMappingURL=config.view-D0AuPmX5.js.map
