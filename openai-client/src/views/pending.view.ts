import {
  TranslationConnectorPendingElement,
  TranslationConnectorPendingElementBase,
} from "@jumoo/translate";
import {
  css,
  customElement,
  html
} from "@umbraco-cms/backoffice/external/lit";

@customElement("jumoo-openai-pending")
export class TranslationOpenAiConnectorPendingElement
  extends TranslationConnectorPendingElementBase
  implements TranslationConnectorPendingElement
{
  render() {
    return html`<uui-box>
      <div class="setting">
        <div class="title">Model</div>
        <div class="value">
            ${this.connector?.settings?.model ?? "text-davinci-003"}
        </div>
      </div>
      <div class="setting">
        <div class="title">Max Tokens</div>
        <div class="value">
            ${this.connector?.settings?.maxTokens ?? "500"}
        </div>
      </div>
      <div class="setting">
        <div class="title">Temperature</div>
        <div class="value">
            ${this.connector?.settings?.temperature ?? "0"}
        </div>
      </div>
      <div class="setting">
        <div class="title">Frequency Penalty</div>
        <div class="value">
            ${this.connector?.settings?.frequencyPenalty ?? "0"}
        </div>
      </div>
      <div class="setting">
        <div class="title">Presence Penalty</div>
        <div class="value">
            ${this.connector?.settings?.presencePenalty ?? "0"}
        </div>
      </div>
      <div class="setting">
        <div class="title">Nucleus Sampling</div>
        <div class="value">
            ${this.connector?.settings?.nucleusSampling ?? "1"}
        </div>
      </div>
    </uui-box>`;
  }
  static styles = css`
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
}

export default TranslationOpenAiConnectorPendingElement;
