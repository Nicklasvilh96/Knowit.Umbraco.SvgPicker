var v = (i) => {
  throw TypeError(i);
};
var y = (i, o, e) => o.has(i) || v("Cannot " + e);
var a = (i, o, e) => (y(i, o, "read from private field"), e ? e.call(i) : o.get(i)), m = (i, o, e) => o.has(i) ? v("Cannot add the same private member more than once") : o instanceof WeakSet ? o.add(i) : o.set(i, e);
var n = (i, o, e) => (y(i, o, "access private method"), e);
import { LitElement as C, html as s, nothing as h, css as E } from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyValueChangeEvent as w } from "@umbraco-cms/backoffice/property-editor";
var r, l, g, b, k, _, $, u, z, S;
const p = class p extends C {
  constructor() {
    super(...arguments);
    m(this, r);
    this.value = "", this.config = [], this._symbols = [], this._loading = !1, this._error = null, this._filter = "", this._open = !1;
  }
  connectedCallback() {
    super.connectedCallback(), a(this, r, l) && n(this, r, b).call(this);
  }
  updated(e) {
    e.has("config") && a(this, r, l) && this._symbols.length === 0 && !this._loading && n(this, r, b).call(this);
  }
  render() {
    return a(this, r, l) ? s`
      <div class="picker">
        ${this._open ? n(this, r, S).call(this) : n(this, r, z).call(this)}
      </div>
    ` : s`<p class="notice">Configure an SVG sprite path on the data type.</p>`;
  }
};
r = new WeakSet(), l = function() {
  var e, t;
  return ((t = (e = this.config) == null ? void 0 : e.find((d) => d.alias === "svgPath")) == null ? void 0 : t.value) ?? "";
}, g = function() {
  var e, t;
  return ((t = (e = this.config) == null ? void 0 : e.find((d) => d.alias === "editorTitle")) == null ? void 0 : t.value) ?? "Select icon";
}, b = async function() {
  this._loading = !0, this._error = null;
  try {
    const e = await fetch(a(this, r, l));
    if (!e.ok) throw new Error(`${e.status} ${e.statusText}`);
    const t = await e.text(), x = new DOMParser().parseFromString(t, "image/svg+xml");
    if (x.querySelector("parsererror")) throw new Error("Invalid SVG file");
    this._symbols = Array.from(x.querySelectorAll("symbol")).map((c) => ({
      id: c.getAttribute("id") ?? "",
      viewBox: c.getAttribute("viewBox") ?? "0 0 24 24"
    })).filter((c) => c.id);
  } catch (e) {
    this._error = e instanceof Error ? e.message : "Failed to load sprite";
  } finally {
    this._loading = !1;
  }
}, k = function(e) {
  this.value = e, this._open = !1, this._filter = "", this.dispatchEvent(new w());
}, _ = function() {
  this.value = "", this.dispatchEvent(new w());
}, $ = function() {
  const e = this._filter.toLowerCase();
  return e ? this._symbols.filter((t) => t.id.toLowerCase().includes(e)) : this._symbols;
}, u = function(e, t = 40) {
  return s`
      <svg width="${t}" height="${t}" aria-hidden="true">
        <use href="${a(this, r, l)}#${e}"></use>
      </svg>
    `;
}, z = function() {
  return s`
      <div class="trigger">
        ${this.value ? s`
          <div class="preview">
            <div class="preview-icon">${n(this, r, u).call(this, this.value, 48)}</div>
            <div class="preview-meta">
              <span class="preview-id">${this.value}</span>
            </div>
          </div>
          <div class="trigger-actions">
            <button class="btn" @click=${() => {
    this._open = !0;
  }}>Change</button>
            <button class="btn btn-ghost" @click=${n(this, r, _)}>Clear</button>
          </div>
        ` : s`
          <button class="btn-pick" @click=${() => {
    this._open = !0;
  }}>
            <span class="btn-pick-icon">+</span>
            ${a(this, r, g)}
          </button>
        `}
      </div>
    `;
}, S = function() {
  const e = a(this, r, $);
  return s`
      <div class="overlay">
        <div class="overlay-header">
          <span class="overlay-title">${a(this, r, g)}</span>
          <button class="btn-close" @click=${() => {
    this._open = !1, this._filter = "";
  }}>✕</button>
        </div>
        <div class="overlay-search">
          <input
            class="search-input"
            type="search"
            placeholder="Search icons…"
            .value=${this._filter}
            @input=${(t) => {
    this._filter = t.target.value;
  }} />
        </div>
        <div class="overlay-body">
          ${this._loading ? s`<div class="loading"><div class="spinner"></div></div>` : h}
          ${this._error ? s`<p class="error">${this._error}</p>` : h}
          ${!this._loading && !this._error && e.length === 0 ? s`<p class="empty">${this._filter ? "No matches." : "No symbols found in sprite."}</p>` : h}
          <div class="grid">
            ${e.map((t) => s`
              <button
                class="grid-item ${this.value === t.id ? "active" : ""}"
                title="${t.id}"
                @click=${() => n(this, r, k).call(this, t.id)}>
                ${n(this, r, u).call(this, t.id, 32)}
                <span class="grid-label">${t.id}</span>
              </button>
            `)}
          </div>
        </div>
      </div>
    `;
}, p.properties = {
  value: { type: String },
  config: { attribute: !1 },
  _symbols: { state: !0 },
  _loading: { state: !0 },
  _error: { state: !0 },
  _filter: { state: !0 },
  _open: { state: !0 }
}, p.styles = E`
    :host { display: block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; }

    .notice { color: #888; font-size: 13px; font-style: italic; }
    .error  { color: #c62828; font-size: 13px; }
    .empty  { color: #888; font-size: 13px; font-style: italic; }

    /* Trigger */
    .trigger { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

    .btn-pick {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 14px; background: #f5f5f5; border: 1.5px dashed #ccc;
      border-radius: 5px; color: #555; font-size: 13px; cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
    }
    .btn-pick:hover { background: #ebebeb; border-color: #aaa; }
    .btn-pick-icon { font-size: 16px; line-height: 1; color: #1c85c7; }

    .preview { display: flex; align-items: center; gap: 12px; }
    .preview-icon {
      width: 56px; height: 56px; border: 1px solid #e0e0e0; border-radius: 6px;
      display: flex; align-items: center; justify-content: center; background: #fafafa;
    }
    .preview-id { font-size: 12px; font-family: monospace; color: #444; }

    .trigger-actions { display: flex; gap: 8px; }

    .btn {
      padding: 5px 12px; border: 1px solid #d0dce8; border-radius: 4px;
      background: #fff; color: #445; font-size: 12px; font-weight: 600;
      cursor: pointer; transition: background 0.15s, border-color 0.15s;
    }
    .btn:hover { border-color: #1c85c7; color: #1c85c7; background: #f0f8ff; }
    .btn-ghost { border-color: #ddd; color: #888; }
    .btn-ghost:hover { border-color: #f44336; color: #f44336; background: #fff5f5; }

    /* Overlay */
    .overlay {
      border: 1px solid #e0e0e0; border-radius: 8px; background: #fff;
      box-shadow: 0 4px 20px rgba(0,0,0,0.12); overflow: hidden;
    }
    .overlay-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px; background: #f7f9fb;
      border-bottom: 1px solid #e8ecf0;
    }
    .overlay-title { font-size: 13px; font-weight: 700; color: #2c3e50; letter-spacing: 0.01em; }
    .btn-close {
      background: none; border: none; font-size: 14px; color: #888;
      cursor: pointer; padding: 2px 6px; border-radius: 3px;
    }
    .btn-close:hover { background: #eee; color: #333; }

    .overlay-search { padding: 10px 12px; border-bottom: 1px solid #eee; }
    .search-input {
      width: 100%; padding: 7px 10px; border: 1.5px solid #dde4ec;
      border-radius: 5px; font-size: 13px; box-sizing: border-box;
    }
    .search-input:focus { outline: none; border-color: #1c85c7; box-shadow: 0 0 0 3px rgba(28,133,199,0.08); }

    .overlay-body { padding: 12px; max-height: 360px; overflow-y: auto; }

    .loading { display: flex; justify-content: center; padding: 24px; }
    .spinner {
      width: 24px; height: 24px; border: 2px solid #e0e0e0;
      border-top-color: #1c85c7; border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
      gap: 6px;
    }
    .grid-item {
      display: flex; flex-direction: column; align-items: center; gap: 5px;
      padding: 8px 4px; border: 1.5px solid #eee; border-radius: 6px;
      background: #fff; cursor: pointer;
      transition: border-color 0.12s, background 0.12s;
    }
    .grid-item:hover { border-color: #96c8e6; background: #f0f8ff; }
    .grid-item.active { border-color: #1c85c7; background: #e8f4fd; }
    .grid-label {
      font-size: 10px; color: #666; text-align: center;
      word-break: break-all; line-height: 1.3;
      max-width: 68px; overflow: hidden; display: -webkit-box;
      -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    }
    .grid-item.active .grid-label { color: #1c85c7; font-weight: 600; }
  `;
let f = p;
customElements.define("knowit-svg-picker", f);
export {
  f as default
};
