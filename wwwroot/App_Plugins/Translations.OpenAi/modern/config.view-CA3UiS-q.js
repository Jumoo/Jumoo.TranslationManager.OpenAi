import { TranslationConnectorConfigElementBase as C, JUMOO_TM_CONNECTOR_SETTINGS_CONTEXT as O } from "@jumoo/translate";
import { html as u, css as R, customElement as $ } from "@umbraco-cms/backoffice/external/lit";
import { O as A } from "./index-CPgL5ne9.js";
class T extends Error {
  constructor(t, r, i) {
    super(i), this.name = "ApiError", this.url = r.url, this.status = r.status, this.statusText = r.statusText, this.body = r.body, this.request = t;
  }
}
class P extends Error {
  constructor(t) {
    super(t), this.name = "CancelError";
  }
  get isCancelled() {
    return !0;
  }
}
class E {
  constructor(t) {
    this._isResolved = !1, this._isRejected = !1, this._isCancelled = !1, this.cancelHandlers = [], this.promise = new Promise((r, i) => {
      this._resolve = r, this._reject = i;
      const n = (a) => {
        this._isResolved || this._isRejected || this._isCancelled || (this._isResolved = !0, this._resolve && this._resolve(a));
      }, s = (a) => {
        this._isResolved || this._isRejected || this._isCancelled || (this._isRejected = !0, this._reject && this._reject(a));
      }, o = (a) => {
        this._isResolved || this._isRejected || this._isCancelled || this.cancelHandlers.push(a);
      };
      return Object.defineProperty(o, "isResolved", {
        get: () => this._isResolved
      }), Object.defineProperty(o, "isRejected", {
        get: () => this._isRejected
      }), Object.defineProperty(o, "isCancelled", {
        get: () => this._isCancelled
      }), t(n, s, o);
    });
  }
  get [Symbol.toStringTag]() {
    return "Cancellable Promise";
  }
  then(t, r) {
    return this.promise.then(t, r);
  }
  catch(t) {
    return this.promise.catch(t);
  }
  finally(t) {
    return this.promise.finally(t);
  }
  cancel() {
    if (!(this._isResolved || this._isRejected || this._isCancelled)) {
      if (this._isCancelled = !0, this.cancelHandlers.length)
        try {
          for (const t of this.cancelHandlers)
            t();
        } catch (t) {
          console.warn("Cancellation threw an error", t);
          return;
        }
      this.cancelHandlers.length = 0, this._reject && this._reject(new P("Request aborted"));
    }
  }
  get isCancelled() {
    return this._isCancelled;
  }
}
const d = (e) => typeof e == "string", y = (e) => d(e) && e !== "", b = (e) => e instanceof Blob, w = (e) => e instanceof FormData, j = (e) => {
  try {
    return btoa(e);
  } catch {
    return Buffer.from(e).toString("base64");
  }
}, q = (e) => {
  const t = [], r = (n, s) => {
    t.push(`${encodeURIComponent(n)}=${encodeURIComponent(String(s))}`);
  }, i = (n, s) => {
    s != null && (s instanceof Date ? r(n, s.toISOString()) : Array.isArray(s) ? s.forEach((o) => i(n, o)) : typeof s == "object" ? Object.entries(s).forEach(([o, a]) => i(`${n}[${o}]`, a)) : r(n, s));
  };
  return Object.entries(e).forEach(([n, s]) => i(n, s)), t.length ? `?${t.join("&")}` : "";
}, N = (e, t) => {
  const r = encodeURI, i = t.url.replace("{api-version}", e.VERSION).replace(/{(.*?)}/g, (s, o) => {
    var a;
    return (a = t.path) != null && a.hasOwnProperty(o) ? r(String(t.path[o])) : s;
  }), n = e.BASE + i;
  return t.query ? n + q(t.query) : n;
}, U = (e) => {
  if (e.formData) {
    const t = new FormData(), r = (i, n) => {
      d(n) || b(n) ? t.append(i, n) : t.append(i, JSON.stringify(n));
    };
    return Object.entries(e.formData).filter(([, i]) => i != null).forEach(([i, n]) => {
      Array.isArray(n) ? n.forEach((s) => r(i, s)) : r(i, n);
    }), t;
  }
}, p = async (e, t) => typeof t == "function" ? t(e) : t, H = async (e, t) => {
  const [r, i, n, s] = await Promise.all([
    // @ts-ignore
    p(t, e.TOKEN),
    // @ts-ignore
    p(t, e.USERNAME),
    // @ts-ignore
    p(t, e.PASSWORD),
    // @ts-ignore
    p(t, e.HEADERS)
  ]), o = Object.entries({
    Accept: "application/json",
    ...s,
    ...t.headers
  }).filter(([, a]) => a != null).reduce(
    (a, [c, l]) => ({
      ...a,
      [c]: String(l)
    }),
    {}
  );
  if (y(r) && (o.Authorization = `Bearer ${r}`), y(i) && y(n)) {
    const a = j(`${i}:${n}`);
    o.Authorization = `Basic ${a}`;
  }
  return t.body !== void 0 && (t.mediaType ? o["Content-Type"] = t.mediaType : b(t.body) ? o["Content-Type"] = t.body.type || "application/octet-stream" : d(t.body) ? o["Content-Type"] = "text/plain" : w(t.body) || (o["Content-Type"] = "application/json")), new Headers(o);
}, M = (e) => {
  var t, r;
  if (e.body !== void 0)
    return (t = e.mediaType) != null && t.includes("application/json") || (r = e.mediaType) != null && r.includes("+json") ? JSON.stringify(e.body) : d(e.body) || b(e.body) || w(e.body) ? e.body : JSON.stringify(e.body);
}, k = async (e, t, r, i, n, s, o) => {
  const a = new AbortController();
  let c = {
    headers: s,
    body: i ?? n,
    method: t.method,
    signal: a.signal
  };
  e.WITH_CREDENTIALS && (c.credentials = e.CREDENTIALS);
  for (const l of e.interceptors.request._fns)
    c = await l(c);
  return o(() => a.abort()), await fetch(r, c);
}, I = (e, t) => {
  if (t) {
    const r = e.headers.get(t);
    if (d(r))
      return r;
  }
}, D = async (e) => {
  if (e.status !== 204)
    try {
      const t = e.headers.get("Content-Type");
      if (t) {
        const r = [
          "application/octet-stream",
          "application/pdf",
          "application/zip",
          "audio/",
          "image/",
          "video/"
        ];
        if (t.includes("application/json") || t.includes("+json"))
          return await e.json();
        if (r.some((i) => t.includes(i)))
          return await e.blob();
        if (t.includes("multipart/form-data"))
          return await e.formData();
        if (t.includes("text/"))
          return await e.text();
      }
    } catch (t) {
      console.error(t);
    }
}, B = (e, t) => {
  const i = {
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Payload Too Large",
    414: "URI Too Long",
    415: "Unsupported Media Type",
    416: "Range Not Satisfiable",
    417: "Expectation Failed",
    418: "Im a teapot",
    421: "Misdirected Request",
    422: "Unprocessable Content",
    423: "Locked",
    424: "Failed Dependency",
    425: "Too Early",
    426: "Upgrade Required",
    428: "Precondition Required",
    429: "Too Many Requests",
    431: "Request Header Fields Too Large",
    451: "Unavailable For Legal Reasons",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    506: "Variant Also Negotiates",
    507: "Insufficient Storage",
    508: "Loop Detected",
    510: "Not Extended",
    511: "Network Authentication Required",
    ...e.errors
  }[t.status];
  if (i)
    throw new T(e, t, i);
  if (!t.ok) {
    const n = t.status ?? "unknown", s = t.statusText ?? "unknown", o = (() => {
      try {
        return JSON.stringify(t.body, null, 2);
      } catch {
        return;
      }
    })();
    throw new T(
      e,
      t,
      `Generic Error: status: ${n}; status text: ${s}; body: ${o}`
    );
  }
}, F = (e, t) => new E(async (r, i, n) => {
  try {
    const s = N(e, t), o = U(t), a = M(t), c = await H(e, t);
    if (!n.isCancelled) {
      let l = await k(
        e,
        t,
        s,
        a,
        o,
        c,
        n
      );
      for (const x of e.interceptors.response._fns)
        l = await x(l);
      const f = await D(l), _ = I(
        l,
        t.responseHeader
      );
      let g = f;
      t.responseTransformer && l.ok && (g = await t.responseTransformer(f));
      const v = {
        url: s,
        ok: l.ok,
        status: l.status,
        statusText: l.statusText,
        body: _ ?? g
      };
      B(t, v), r(v.body);
    }
  } catch (s) {
    i(s);
  }
}), L = () => F(A, {
  method: "GET",
  url: "/umbraco/tm-openai/api/v1/Models"
});
var K = Object.defineProperty, z = Object.getOwnPropertyDescriptor, S = (e) => {
  throw TypeError(e);
}, G = (e, t, r, i) => {
  for (var n = i > 1 ? void 0 : i ? z(t, r) : t, s = e.length - 1, o; s >= 0; s--)
    (o = e[s]) && (n = (i ? o(t, r, n) : o(n)) || n);
  return i && n && K(t, r, n), n;
}, J = (e, t, r) => t.has(e) || S("Cannot " + r), W = (e, t, r) => t.has(e) ? S("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), V = (e, t, r, i) => (J(e, t, "write to private field"), t.set(e, r), r), m;
let h = class extends C {
  constructor() {
    super(), W(this, m), this.consumeContext(O, (e) => {
      V(this, m, e);
    });
  }
  async connectedCallback() {
    super.connectedCallback();
    const e = await L();
    console.log(e);
  }
  render() {
    return u`
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
    return u` <umb-property-layout
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
    return u` <umb-property-layout
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
    return u` <umb-property-layout
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
    return u` <umb-property-layout
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
    return u`<umb-property-layout
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
    ]}
             @change=${this.onUpdateOption}></uui-select>
            </div></umb-property-layout>`;
  }
  renderModel() {
    var e;
    return u`<umb-property-layout
          label="Model"
          description="OpenAi Model to use to translation">
            <div slot="editor">
              <uui-input
              id="model"
              label="Model"
              value=${((e = this.settings) == null ? void 0 : e.model) ?? "gpt-3.5-turbo-instruct"}
              @change=${this.onUpdateOption}>
              </uui-input>
            </div>
          </umb-property-layout>`;
  }
  renderMaxTokens() {
    var e;
    return u`<umb-property-layout
          label="Max Tokens"
          description="The maximum number of tokens to generate in the completion.">
            <div slot="editor">
              <uui-input
              id="maxTokens"
              label="MaxTokens"
              type="number"
              value=${((e = this.settings) == null ? void 0 : e.maxTokens) ?? 500}
              @change=${this.onUpdateOption}>
              </uui-input>
            </div>
          </umb-property-layout>`;
  }
  renderTemperature() {
    var e;
    return u`<umb-property-layout
          label="Temperature"
          description="Sampling temperature">
            <div slot="editor">
              <uui-input
              id="temperature"
              label="Temperature"
              type="number"
              step="0.1"
              value=${((e = this.settings) == null ? void 0 : e.temperature) ?? 0}
              @change=${this.onUpdateOption}>
            </uui-input>
            </div>
          </umb-property-layout>`;
  }
  renderFrequencyPenalty() {
    var e;
    return u`<umb-property-layout
          label="Frequency Penalty"
          description="Positive values penalize new tokens based on their existing frequency in the text so far">
            <div slot="editor">
              <uui-input
              id="frequencyPenalty"
              label="FrequencyPenalty"
              type="number"
              step="0.1"
              value=${((e = this.settings) == null ? void 0 : e.frequencyPenalty) ?? 0}
              @change=${this.onUpdateOption}>
            </uui-input>
            </div>
          </umb-property-layout>`;
  }
  renderPresencePenalty() {
    var e;
    return u`<umb-property-layout
          label="Presence Penalty"
          description="Positive values penalize new tokens based on their existing frequency in the text so far">
            <div slot="editor">
              <uui-input
              id="presencePenalty"
              label="PresencePenalty"
              type="number"
              step="0.1"
              value=${((e = this.settings) == null ? void 0 : e.presencePenalty) ?? 0}
              @change=${this.onUpdateOption}>
            </uui-input>
            </div>
          </umb-property-layout>`;
  }
  renderNucleusSamplingFactor() {
    var e;
    return u`<umb-property-layout
          label="Nucleus sampling"
          description="">
            <div slot="editor">
              <uui-input
              id="nucleusSampling"
              label="NucleusSampling"
              type="number"
              value=${((e = this.settings) == null ? void 0 : e.nucleusSampling) ?? 1}
              @change=${this.onUpdateOption}>
            </uui-input>
            </div>
          </umb-property-layout>`;
  }
};
m = /* @__PURE__ */ new WeakMap();
h.styles = R`
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
h = G([
  $("jumoo-openai-config")
], h);
const Z = h;
export {
  h as TranslationOpenAiConnectorConfigElement,
  Z as default
};
//# sourceMappingURL=config.view-CA3UiS-q.js.map
