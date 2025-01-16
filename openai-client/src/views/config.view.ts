import { JUMOO_TM_CONNECTOR_SETTINGS_CONTEXT, TranslationConnectorConfigElement, TranslationConnectorConfigElementBase, TranslationConnectorSettingsContext } from "@jumoo/translate";
import { css, customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { openAiTranslateModels } from "../api";

@customElement("jumoo-openai-config")
export class TranslationOpenAiConnectorConfigElement 
    extends TranslationConnectorConfigElementBase
    implements TranslationConnectorConfigElement 
    {    
        #context?: TranslationConnectorSettingsContext;
  
        constructor() {
          super();
      
          this.consumeContext(JUMOO_TM_CONNECTOR_SETTINGS_CONTEXT, (_context) => {
            this.#context = _context;
          });
        }

        async connectedCallback() {
          super.connectedCallback();

          const models = await openAiTranslateModels();
          console.log(models);

        }

        render(){
            return html`
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
          </umb-body-layout>`
        }

        renderApiKey() {
          return html` <umb-property-layout
            label="Api Key"
            description="OpenAi Translation Api Key"
            ><div slot="editor">
              <uui-input
                id="apiKey"
                label="ApiKey"
                .value=${(this.settings?.apiKey as string) ?? ""}
                @change=${this.onUpdateOption}
              ></uui-input>
            </div>
          </umb-property-layout>`;
        }
  
        renderThrottle() {
          const throttle = this.settings?.throttle || 250;
      
          return html` <umb-property-layout
            label="Throttle"
            description="Number of milliseconds to wait between calls (To Avoid API Throttling)"
          >
            <div slot="editor">
              <uui-input
                id="throttle"
                value=${throttle}
                label="throttle (ms)"
                @change=${this.onUpdateOption}
              ></uui-input>
            </div>
          </umb-property-layout>`;
        }
  
        renderSplitOption() {
          return html` <umb-property-layout
            label="Split"
            description="Split any HTML before sending to translation"
          >
            <div slot="editor">
              <uui-checkbox
                label="Split Html"
                id="split"
                .checked=${(this.settings?.split as boolean) ?? false}
                @change=${this.onUpdateOption}
              >
              </uui-checkbox>
            </div>
          </umb-property-layout>`;
        }
  
        renderSendAsHtmlOption() {
          return html` <umb-property-layout
            label="Send as HTML"
            description="Make sure html elments are marked as html when sent to translation"
          >
            <div slot="editor">
              <uui-checkbox
                id="asHtml"
                label="Send as HTML"
                .checked=${(this.settings?.asHtml as boolean) ?? false}
                @change=${this.onUpdateOption}
              >
              </uui-checkbox>
            </div>
          </umb-property-layout>`;
        }

        renderService(){
          const options: Array<Option> = [
            { name: 'Carrot', value: 'orange' },
            { name: 'Cucumber', value: 'green' },
            { name: 'Aubergine', value: 'purple' },
            { name: 'Blueberry', value: 'Blue' },
            { name: 'Banana', value: 'yellow' },
            { name: 'Strawberry', value: 'red' },];

          return html`<umb-property-layout
          label="OpenAi Library"
          description="Choose which API Library to use when sending translations">
            <div slot="editor">
             <uui-select
             placeholder="Select an option"
             .options=${options}
             @change=${this.onUpdateOption}></uui-select>
            </div></umb-property-layout>`
        }

        renderModel(){
          return html`<umb-property-layout
          label="Model"
          description="OpenAi Model to use to translation">
            <div slot="editor">
              <uui-input
              id="model"
              label="Model"
              value=${(this.settings?.model as string) ?? "gpt-3.5-turbo-instruct"}
              @change=${this.onUpdateOption}>
              </uui-input>
            </div>
          </umb-property-layout>`
        }

        renderMaxTokens(){
          return html`<umb-property-layout
          label="Max Tokens"
          description="The maximum number of tokens to generate in the completion.">
            <div slot="editor">
              <uui-input
              id="maxTokens"
              label="MaxTokens"
              type="number"
              value=${(this.settings?.maxTokens as number) ?? 500}
              @change=${this.onUpdateOption}>
              </uui-input>
            </div>
          </umb-property-layout>`
        }

        renderTemperature(){
          return html`<umb-property-layout
          label="Temperature"
          description="Sampling temperature">
            <div slot="editor">
              <uui-input
              id="temperature"
              label="Temperature"
              type="number"
              step="0.1"
              value=${(this.settings?.temperature as number) ?? 0.0}
              @change=${this.onUpdateOption}>
            </uui-input>
            </div>
          </umb-property-layout>`
        }

        renderFrequencyPenalty(){
          return html`<umb-property-layout
          label="Frequency Penalty"
          description="Positive values penalize new tokens based on their existing frequency in the text so far">
            <div slot="editor">
              <uui-input
              id="frequencyPenalty"
              label="FrequencyPenalty"
              type="number"
              step="0.1"
              value=${(this.settings?.frequencyPenalty as number) ?? 0.0}
              @change=${this.onUpdateOption}>
            </uui-input>
            </div>
          </umb-property-layout>`
        }

        renderPresencePenalty(){
          return html`<umb-property-layout
          label="Presence Penalty"
          description="Positive values penalize new tokens based on their existing frequency in the text so far">
            <div slot="editor">
              <uui-input
              id="presencePenalty"
              label="PresencePenalty"
              type="number"
              step="0.1"
              value=${(this.settings?.presencePenalty as number) ?? 0.0}
              @change=${this.onUpdateOption}>
            </uui-input>
            </div>
          </umb-property-layout>`
        }

        renderNucleusSamplingFactor(){
          return html`<umb-property-layout
          label="Nucleus sampling"
          description="">
            <div slot="editor">
              <uui-input
              id="nucleusSampling"
              label="NucleusSampling"
              type="number"
              value=${(this.settings?.nucleusSampling as number) ?? 1}
              @change=${this.onUpdateOption}>
            </uui-input>
            </div>
          </umb-property-layout>`
        }

        static styles = css`
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
    }

export default TranslationOpenAiConnectorConfigElement;