var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _pickableFilter, _KnowitSvgSpritePathPickerElement_instances, selection_get, onChange_fn;
import { LitElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";
import { UmbServerFilePathUniqueSerializer } from "@umbraco-cms/backoffice/server-file-system";
import "@umbraco-cms/backoffice/static-file";
const serializer = new UmbServerFilePathUniqueSerializer();
const WWWROOT_PREFIX = /^\/wwwroot(?=\/|$)/i;
function toPublicPath(apiRootedPath) {
  return apiRootedPath.replace(WWWROOT_PREFIX, "") || "/";
}
function toApiRootedPath(publicPath) {
  return WWWROOT_PREFIX.test(publicPath) ? publicPath : `/wwwroot${publicPath.startsWith("/") ? "" : "/"}${publicPath}`;
}
const _KnowitSvgSpritePathPickerElement = class _KnowitSvgSpritePathPickerElement extends LitElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _KnowitSvgSpritePathPickerElement_instances);
    __privateAdd(this, _pickableFilter);
    this.value = "";
    __privateSet(this, _pickableFilter, (item) => item.unique.endsWith("svg"));
  }
  render() {
    return html`
      <umb-input-static-file
        .selection=${__privateGet(this, _KnowitSvgSpritePathPickerElement_instances, selection_get)}
        .pickableFilter=${__privateGet(this, _pickableFilter)}
        .min=${0}
        .max=${1}
        @change=${__privateMethod(this, _KnowitSvgSpritePathPickerElement_instances, onChange_fn)}>
      </umb-input-static-file>
    `;
  }
};
_pickableFilter = new WeakMap();
_KnowitSvgSpritePathPickerElement_instances = new WeakSet();
selection_get = function() {
  return this.value ? [serializer.toUnique(toApiRootedPath(this.value))] : [];
};
onChange_fn = function(e) {
  const selection = e.target.selection;
  const unique = selection == null ? void 0 : selection[0];
  const apiRootedPath = unique ? serializer.toServerPath(unique) : null;
  this.value = apiRootedPath ? toPublicPath(apiRootedPath) : "";
  this.dispatchEvent(new UmbChangeEvent());
};
_KnowitSvgSpritePathPickerElement.properties = {
  value: { type: String }
};
let KnowitSvgSpritePathPickerElement = _KnowitSvgSpritePathPickerElement;
customElements.define("knowit-svg-sprite-path-picker", KnowitSvgSpritePathPickerElement);
export {
  KnowitSvgSpritePathPickerElement as default
};
