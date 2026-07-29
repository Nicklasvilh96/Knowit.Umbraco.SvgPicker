import { LitElement, html, css, nothing } from '@umbraco-cms/backoffice/external/lit';
import { UmbPropertyValueChangeEvent } from '@umbraco-cms/backoffice/property-editor';

interface SvgSymbol {
  id: string;
  viewBox: string;
}

class KnowitSvgPickerElement extends LitElement {
  static properties = {
    value:   { type: String },
    config:  { attribute: false },
    _symbols:  { state: true },
    _loading:  { state: true },
    _error:    { state: true },
    _filter:   { state: true },
    _open:     { state: true },
    _cacheBust: { state: true },
  };

  value: string = '';
  config: Array<{ alias: string; value: unknown }> = [];

  private _symbols: SvgSymbol[] = [];
  private _loading = false;
  private _error: string | null = null;
  private _filter = '';
  private _open = false;
  private _cacheBust = Date.now();

  get #svgPath(): string {
    return (this.config?.find(c => c.alias === 'svgPath')?.value as string) ?? '';
  }

  get #versionedSvgPath(): string {
    const separator = this.#svgPath.includes('?') ? '&' : '?';
    return `${this.#svgPath}${separator}v=${this._cacheBust}`;
  }

  get #editorTitle(): string {
    return (this.config?.find(c => c.alias === 'editorTitle')?.value as string) ?? 'Select icon';
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.#svgPath) this.#loadSymbols();
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('config') && this.#svgPath && this._symbols.length === 0 && !this._loading) {
      this.#loadSymbols();
    }
  }

  async #loadSymbols() {
    this._loading = true;
    this._error = null;
    this._cacheBust = Date.now();
    try {
      const res = await fetch(this.#svgPath, { cache: 'no-store' });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const text = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'image/svg+xml');
      const parserError = doc.querySelector('parsererror');
      if (parserError) throw new Error('Invalid SVG file');
      this._symbols = Array.from(doc.querySelectorAll('symbol'))
        .map(sym => ({
          id: sym.getAttribute('id') ?? '',
          viewBox: sym.getAttribute('viewBox') ?? '0 0 24 24',
        }))
        .filter(s => s.id);
    } catch (e) {
      this._error = e instanceof Error ? e.message : 'Failed to load sprite';
    } finally {
      this._loading = false;
    }
  }

  #select(id: string) {
    this.value = id;
    this._open = false;
    this._filter = '';
    this.dispatchEvent(new UmbPropertyValueChangeEvent());
  }

  #clear() {
    this.value = '';
    this.dispatchEvent(new UmbPropertyValueChangeEvent());
  }

  get #filtered(): SvgSymbol[] {
    const q = this._filter.toLowerCase();
    return q ? this._symbols.filter(s => s.id.toLowerCase().includes(q)) : this._symbols;
  }

  #renderSymbol(id: string, size = 40) {
    return html`
      <svg width="${size}" height="${size}" aria-hidden="true">
        <use href="${this.#versionedSvgPath}#${id}"></use>
      </svg>
    `;
  }

  render() {
    if (!this.#svgPath) {
      return html`<p class="notice">Configure an SVG sprite path on the data type.</p>`;
    }

    return html`
      <div class="picker">
        ${this._open ? this.#renderOverlay() : this.#renderTrigger()}
      </div>
    `;
  }

  #renderTrigger() {
    return html`
      <div class="trigger">
        ${this.value ? html`
          <div class="preview">
            <div class="preview-icon">${this.#renderSymbol(this.value, 48)}</div>
            <div class="preview-meta">
              <span class="preview-id">${this.value}</span>
            </div>
          </div>
          <div class="trigger-actions">
            <button class="btn" @click=${() => { this._open = true; }}>Change</button>
            <button class="btn btn-ghost" @click=${this.#clear}>Clear</button>
          </div>
        ` : html`
          <button class="btn-pick" @click=${() => { this._open = true; }}>
            <span class="btn-pick-icon">+</span>
            ${this.#editorTitle}
          </button>
        `}
      </div>
    `;
  }

  #renderOverlay() {
    const filtered = this.#filtered;
    return html`
      <div class="overlay">
        <div class="overlay-header">
          <span class="overlay-title">${this.#editorTitle}</span>
          <button class="btn-close" @click=${() => { this._open = false; this._filter = ''; }}>✕</button>
        </div>
        <div class="overlay-search">
          <input
            class="search-input"
            type="search"
            placeholder="Search icons…"
            .value=${this._filter}
            @input=${(e: Event) => { this._filter = (e.target as HTMLInputElement).value; }} />
        </div>
        <div class="overlay-body">
          ${this._loading ? html`<div class="loading"><div class="spinner"></div></div>` : nothing}
          ${this._error ? html`<p class="error">${this._error}</p>` : nothing}
          ${!this._loading && !this._error && filtered.length === 0
            ? html`<p class="empty">${this._filter ? 'No matches.' : 'No symbols found in sprite.'}</p>`
            : nothing}
          <div class="grid">
            ${filtered.map(sym => html`
              <button
                class="grid-item ${this.value === sym.id ? 'active' : ''}"
                title="${sym.id}"
                @click=${() => this.#select(sym.id)}>
                ${this.#renderSymbol(sym.id, 32)}
                <span class="grid-label">${sym.id}</span>
              </button>
            `)}
          </div>
        </div>
      </div>
    `;
  }

  static styles = css`
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
}

customElements.define('knowit-svg-picker', KnowitSvgPickerElement);
export default KnowitSvgPickerElement;
