var S = Object.defineProperty;
var U = (t, r, e) => r in t ? S(t, r, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[r] = e;
var j = (t, r, e) => U(t, typeof r != "symbol" ? r + "" : r, e);
import { UMB_AUTH_CONTEXT as R } from "@umbraco-cms/backoffice/auth";
const _ = {
  type: "jumoo-tm-connector",
  alias: "jumoo-tm-openai-connector",
  name: "OpenAi Connector",
  meta: {
    icon: "jumoo-tm-openai-logo",
    label: "OpenAi connector",
    alias: "openAiConnector"
  }
}, E = {
  type: "jumoo-tm-connector-config",
  alias: "jumoo-openai-config",
  name: "OpenAi Connector Config",
  elementName: "jumoo-openai-config",
  js: () => import("./config.view-CjhFxEX0.js")
}, z = {
  type: "jumoo-tm-connector-pending",
  alias: "jumoo-openai-pending",
  name: "OpenAi Connector Pending",
  elementName: "jumoo-openai-pending",
  js: () => import("./pending.view-FUF8RnnC.js")
}, W = [E, z], I = {
  type: "icons",
  alias: "jumoo.tm.icons.openai",
  name: "Translation Manager OpenAi Icon",
  js: () => import("./icons-24jZE_A9.js")
}, N = [I];
var k = async (t, r) => {
  let e = typeof r == "function" ? await r(t) : r;
  if (e) return t.scheme === "bearer" ? `Bearer ${e}` : t.scheme === "basic" ? `Basic ${btoa(e)}` : e;
}, D = { bodySerializer: (t) => JSON.stringify(t, (r, e) => typeof e == "bigint" ? e.toString() : e) }, P = (t) => {
  switch (t) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, H = (t) => {
  switch (t) {
    case "form":
      return ",";
    case "pipeDelimited":
      return "|";
    case "spaceDelimited":
      return "%20";
    default:
      return ",";
  }
}, B = (t) => {
  switch (t) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, v = ({ allowReserved: t, explode: r, name: e, style: s, value: a }) => {
  if (!r) {
    let o = (t ? a : a.map((l) => encodeURIComponent(l))).join(H(s));
    switch (s) {
      case "label":
        return `.${o}`;
      case "matrix":
        return `;${e}=${o}`;
      case "simple":
        return o;
      default:
        return `${e}=${o}`;
    }
  }
  let i = P(s), n = a.map((o) => s === "label" || s === "simple" ? t ? o : encodeURIComponent(o) : b({ allowReserved: t, name: e, value: o })).join(i);
  return s === "label" || s === "matrix" ? i + n : n;
}, b = ({ allowReserved: t, name: r, value: e }) => {
  if (e == null) return "";
  if (typeof e == "object") throw new Error("Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.");
  return `${r}=${t ? e : encodeURIComponent(e)}`;
}, $ = ({ allowReserved: t, explode: r, name: e, style: s, value: a }) => {
  if (a instanceof Date) return `${e}=${a.toISOString()}`;
  if (s !== "deepObject" && !r) {
    let o = [];
    Object.entries(a).forEach(([p, u]) => {
      o = [...o, p, t ? u : encodeURIComponent(u)];
    });
    let l = o.join(",");
    switch (s) {
      case "form":
        return `${e}=${l}`;
      case "label":
        return `.${l}`;
      case "matrix":
        return `;${e}=${l}`;
      default:
        return l;
    }
  }
  let i = B(s), n = Object.entries(a).map(([o, l]) => b({ allowReserved: t, name: s === "deepObject" ? `${e}[${o}]` : o, value: l })).join(i);
  return s === "label" || s === "matrix" ? i + n : n;
}, J = /\{[^{}]+\}/g, L = ({ path: t, url: r }) => {
  let e = r, s = r.match(J);
  if (s) for (let a of s) {
    let i = !1, n = a.substring(1, a.length - 1), o = "simple";
    n.endsWith("*") && (i = !0, n = n.substring(0, n.length - 1)), n.startsWith(".") ? (n = n.substring(1), o = "label") : n.startsWith(";") && (n = n.substring(1), o = "matrix");
    let l = t[n];
    if (l == null) continue;
    if (Array.isArray(l)) {
      e = e.replace(a, v({ explode: i, name: n, style: o, value: l }));
      continue;
    }
    if (typeof l == "object") {
      e = e.replace(a, $({ explode: i, name: n, style: o, value: l }));
      continue;
    }
    if (o === "matrix") {
      e = e.replace(a, `;${b({ name: n, value: l })}`);
      continue;
    }
    let p = encodeURIComponent(o === "label" ? `.${l}` : l);
    e = e.replace(a, p);
  }
  return e;
}, x = ({ allowReserved: t, array: r, object: e } = {}) => (s) => {
  let a = [];
  if (s && typeof s == "object") for (let i in s) {
    let n = s[i];
    if (n != null) {
      if (Array.isArray(n)) {
        a = [...a, v({ allowReserved: t, explode: !0, name: i, style: "form", value: n, ...r })];
        continue;
      }
      if (typeof n == "object") {
        a = [...a, $({ allowReserved: t, explode: !0, name: i, style: "deepObject", value: n, ...e })];
        continue;
      }
      a = [...a, b({ allowReserved: t, name: i, value: n })];
    }
  }
  return a.join("&");
}, M = (t) => {
  var e;
  if (!t) return "stream";
  let r = (e = t.split(";")[0]) == null ? void 0 : e.trim();
  if (r) {
    if (r.startsWith("application/json") || r.endsWith("+json")) return "json";
    if (r === "multipart/form-data") return "formData";
    if (["application/", "audio/", "image/", "video/"].some((s) => r.startsWith(s))) return "blob";
    if (r.startsWith("text/")) return "text";
  }
}, V = async ({ security: t, ...r }) => {
  for (let e of t) {
    let s = await k(e, r.auth);
    if (!s) continue;
    let a = e.name ?? "Authorization";
    switch (e.in) {
      case "query":
        r.query || (r.query = {}), r.query[a] = s;
        break;
      case "cookie":
        r.headers.append("Cookie", `${a}=${s}`);
        break;
      case "header":
      default:
        r.headers.set(a, s);
        break;
    }
    return;
  }
}, w = (t) => G({ baseUrl: t.baseUrl, path: t.path, query: t.query, querySerializer: typeof t.querySerializer == "function" ? t.querySerializer : x(t.querySerializer), url: t.url }), G = ({ baseUrl: t, path: r, query: e, querySerializer: s, url: a }) => {
  let i = a.startsWith("/") ? a : `/${a}`, n = (t ?? "") + i;
  r && (n = L({ path: r, url: n }));
  let o = e ? s(e) : "";
  return o.startsWith("?") && (o = o.substring(1)), o && (n += `?${o}`), n;
}, C = (t, r) => {
  var s;
  let e = { ...t, ...r };
  return (s = e.baseUrl) != null && s.endsWith("/") && (e.baseUrl = e.baseUrl.substring(0, e.baseUrl.length - 1)), e.headers = A(t.headers, r.headers), e;
}, A = (...t) => {
  let r = new Headers();
  for (let e of t) {
    if (!e || typeof e != "object") continue;
    let s = e instanceof Headers ? e.entries() : Object.entries(e);
    for (let [a, i] of s) if (i === null) r.delete(a);
    else if (Array.isArray(i)) for (let n of i) r.append(a, n);
    else i !== void 0 && r.set(a, typeof i == "object" ? JSON.stringify(i) : i);
  }
  return r;
}, g = class {
  constructor() {
    j(this, "_fns");
    this._fns = [];
  }
  clear() {
    this._fns = [];
  }
  exists(t) {
    return this._fns.indexOf(t) !== -1;
  }
  eject(t) {
    let r = this._fns.indexOf(t);
    r !== -1 && (this._fns = [...this._fns.slice(0, r), ...this._fns.slice(r + 1)]);
  }
  use(t) {
    this._fns = [...this._fns, t];
  }
}, Q = () => ({ error: new g(), request: new g(), response: new g() }), X = x({ allowReserved: !1, array: { explode: !0, style: "form" }, object: { explode: !0, style: "deepObject" } }), F = { "Content-Type": "application/json" }, q = (t = {}) => ({ ...D, headers: F, parseAs: "auto", querySerializer: X, ...t }), K = (t = {}) => {
  let r = C(q(), t), e = () => ({ ...r }), s = (n) => (r = C(r, n), e()), a = Q(), i = async (n) => {
    let o = { ...r, ...n, fetch: n.fetch ?? r.fetch ?? globalThis.fetch, headers: A(r.headers, n.headers) };
    o.security && await V({ ...o, security: o.security }), o.body && o.bodySerializer && (o.body = o.bodySerializer(o.body)), (o.body === void 0 || o.body === "") && o.headers.delete("Content-Type");
    let l = w(o), p = { redirect: "follow", ...o }, u = new Request(l, p);
    for (let f of a.request._fns) u = await f(u, o);
    let T = o.fetch, c = await T(u);
    for (let f of a.response._fns) c = await f(c, u, o);
    let m = { request: u, response: c };
    if (c.ok) {
      if (c.status === 204 || c.headers.get("Content-Length") === "0") return { data: {}, ...m };
      let f = (o.parseAs === "auto" ? M(c.headers.get("Content-Type")) : o.parseAs) ?? "json";
      if (f === "stream") return { data: c.body, ...m };
      let y = await c[f]();
      return f === "json" && (o.responseValidator && await o.responseValidator(y), o.responseTransformer && (y = await o.responseTransformer(y))), { data: y, ...m };
    }
    let h = await c.text();
    try {
      h = JSON.parse(h);
    } catch {
    }
    let d = h;
    for (let f of a.error._fns) d = await f(h, c, u, o);
    if (d = d || {}, o.throwOnError) throw d;
    return { error: d, ...m };
  };
  return { buildUrl: w, connect: (n) => i({ ...n, method: "CONNECT" }), delete: (n) => i({ ...n, method: "DELETE" }), get: (n) => i({ ...n, method: "GET" }), getConfig: e, head: (n) => i({ ...n, method: "HEAD" }), interceptors: a, options: (n) => i({ ...n, method: "OPTIONS" }), patch: (n) => i({ ...n, method: "PATCH" }), post: (n) => i({ ...n, method: "POST" }), put: (n) => i({ ...n, method: "PUT" }), request: i, setConfig: s, trace: (n) => i({ ...n, method: "TRACE" }) };
};
const O = K(
  q({
    baseUrl: "http://localhost:11591",
    throwOnError: !0
  })
), ee = (t, r) => {
  r.registerMany([
    _,
    ...N,
    ...W
    //...localizations
  ]), t.consumeContext(R, (e) => {
    if (!e) return;
    const s = e.getOpenApiConfiguration();
    O.setConfig({
      baseUrl: s.base,
      credentials: s.credentials
    }), O.interceptors.request.use(async (a, i) => {
      const n = await e.getLatestToken();
      return a.headers.set("Authorization", `Bearer ${n}`), a;
    });
  });
};
export {
  O as c,
  ee as o
};
//# sourceMappingURL=index-Dp2j7DRs.js.map
