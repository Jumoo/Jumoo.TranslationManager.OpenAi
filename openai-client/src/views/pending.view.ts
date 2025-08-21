import {
  TranslationConnectorPendingElement,
  TranslationConnectorPendingElementBase,
} from "@jumoo/translate";
import { css, customElement, html } from "@umbraco-cms/backoffice/external/lit";

type openAiSettings = {
  model: string;
  maxTokens: string;
  temperature: string;
  frequencyPenalty: string;
  presencePenalty: string;
  nucleusSampling: string;
};

@customElement("jumoo-openai-pending")
export class TranslationOpenAiConnectorPendingElement
  extends TranslationConnectorPendingElementBase
  implements TranslationConnectorPendingElement
{
  render() {
    const settings = this.connector?.settings as openAiSettings;
    return html`<jumoo-tm-ui-box headline="Settings">
      <div class="setting">
        <div class="title">Model</div>
        <div class="value">${settings?.model ?? "text-davinci-003"}</div>
      </div>
      <div class="setting">
        <div class="title">Max Tokens</div>
        <div class="value">${settings?.maxTokens ?? "500"}</div>
      </div>
      <div class="setting">
        <div class="title">Temperature</div>
        <div class="value">${settings?.temperature ?? "0"}</div>
      </div>
      <div class="setting">
        <div class="title">Frequency Penalty</div>
        <div class="value">${settings?.frequencyPenalty ?? "0"}</div>
      </div>
      <div class="setting">
        <div class="title">Presence Penalty</div>
        <div class="value">${settings?.presencePenalty ?? "0"}</div>
      </div>
      <div class="setting">
        <div class="title">Nucleus Sampling</div>
        <div class="value">${settings?.nucleusSampling ?? "1"}</div>
      </div>
    </jumoo-tm-ui-box>`;
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
