import { TranslationConnectorPendingElement, TranslationConnectorPendingElementBase } from "@jumoo/translate";
import { customElement, html } from "@umbraco-cms/backoffice/external/lit";

@customElement("jumoo-openai-pending")
export class TranslationOpenAiConnectorPendingElement
    extends TranslationConnectorPendingElementBase
    implements TranslationConnectorPendingElement
    {
        render() {
            return html`<p>other words</p>`
        }
    }

export default TranslationOpenAiConnectorPendingElement;