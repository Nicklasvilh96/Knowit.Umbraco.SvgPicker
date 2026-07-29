import { LitElement, html } from '@umbraco-cms/backoffice/external/lit';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import { UmbServerFilePathUniqueSerializer } from '@umbraco-cms/backoffice/server-file-system';
import '@umbraco-cms/backoffice/static-file';

interface StaticFileTreeItem {
  unique: string;
}

const serializer = new UmbServerFilePathUniqueSerializer();

// The static file tree/picker is rooted at the physical content root (which includes the
// wwwroot folder itself), but ASP.NET's static file middleware serves wwwroot's contents
// at the site root - so the path the picker returns must have "/wwwroot" stripped before
// it's usable as a public URL, and re-added when mapping a stored public path back to a
// selection in the picker.
const WWWROOT_PREFIX = /^\/wwwroot(?=\/|$)/i;

function toPublicPath(apiRootedPath: string): string {
  return apiRootedPath.replace(WWWROOT_PREFIX, '') || '/';
}

function toApiRootedPath(publicPath: string): string {
  return WWWROOT_PREFIX.test(publicPath) ? publicPath : `/wwwroot${publicPath.startsWith('/') ? '' : '/'}${publicPath}`;
}

class KnowitSvgSpritePathPickerElement extends LitElement {
  static properties = {
    value: { type: String },
  };

  value: string = '';

  #pickableFilter = (item: StaticFileTreeItem) => item.unique.endsWith('svg');

  get #selection(): string[] {
    return this.value ? [serializer.toUnique(toApiRootedPath(this.value))] : [];
  }

  #onChange(e: Event) {
    const selection = (e.target as unknown as { selection: string[] }).selection;
    const unique = selection?.[0];
    const apiRootedPath = unique ? serializer.toServerPath(unique) : null;
    this.value = apiRootedPath ? toPublicPath(apiRootedPath) : '';
    this.dispatchEvent(new UmbChangeEvent());
  }

  render() {
    return html`
      <umb-input-static-file
        .selection=${this.#selection}
        .pickableFilter=${this.#pickableFilter}
        .min=${0}
        .max=${1}
        @change=${this.#onChange}>
      </umb-input-static-file>
    `;
  }
}

customElements.define('knowit-svg-sprite-path-picker', KnowitSvgSpritePathPickerElement);
export default KnowitSvgSpritePathPickerElement;
