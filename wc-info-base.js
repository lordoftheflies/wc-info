import { define } from "trans-render/define.js";
import { XtalViewElement } from "xtal-element/xtal-view-element.js";
import { createTemplate, newRenderContext } from "xtal-element/utils.js";
import { repeat } from "trans-render/repeat.js";
import "hypo-link/hypo-link.js";
const package_name = "package-name";
const definitionListTemplate = createTemplate(/* html */ `
    <dt></dt><dd></dd>
`);
const eventListTemplate = createTemplate(/* html */ `
<dt>⚡<span></span></dt>
<dd> 
  <h5></h5>
  <h6>Associated Property Name: <span></span></h6>
  <details>
    <summary>Event Detail Properties</summary>
    <dl></dl>
  </details>
</dd>
`);
const WCInfoTemplate = createTemplate(/* html */ `
<section class="WCInfo card">
    <header>
        <div class="WCName"></div>
        <div class="WCDesc"><hypo-link></hypo-link></div>
    </header>
    <section data-type="attributes">
      <details>
          <summary>attributes</summary>
          <dl></dl>
      </details>
    </section>
    <section data-type="properties">
      <details>
        <summary>properties</summary>
        <dl></dl>
      </details>
    </section>
    <section data-type="events">
      <details>
          <summary>events</summary>
          <dl></dl>
      </details>
    </section>
</section>`);
const mainTemplate = createTemplate(/* html */ `
<header>
  <h3></h3>
  <nav>
    <a target="_blank">📜</a>
  </nav>
</header>
<main></main>
`);
const x = {};
export class WCInfoBase extends XtalViewElement {
    constructor() {
        super(...arguments);
        this._initContext = newRenderContext({
            header: {
                h3: this.packageName,
                nav: {
                    a: ({ target }) => {
                        target.href = this._href;
                    }
                    // a: ({target}) => Object.assign<HTMLAnchorElement, HTMLAnchorElement>  (target as HTMLAnchorElement, {
                    //   href: this._href
                    // } as HTMLAnchorElement);
                }
            },
            main: ({ target, ctx }) => {
                const tags = this.viewModel.tags;
                repeat(WCInfoTemplate, ctx, tags.length, target);
                return {
                    section: ({ idx }) => ({
                        header: {
                            ".WCName": tags[idx].name,
                            ".WCDesc": {
                                "hypo-link": tags[idx].description
                            }
                        },
                        "section[data-type='attributes']": {
                            details: {
                                dl: ({ target, ctx }) => {
                                    const attribs = tags[idx].attributes;
                                    if (attribs === undefined)
                                        return;
                                    repeat(definitionListTemplate, ctx, attribs.length, target);
                                    return {
                                        dt: ({ idx }) => attribs[Math.floor(idx / 2)].name,
                                        dd: ({ idx }) => attribs[Math.floor(idx / 2)].description
                                    };
                                }
                            }
                        },
                        "section[data-type='events']": {
                            details: {
                                dl: ({ target, ctx }) => {
                                    const customEvents = tags[idx].customEvents;
                                    if (customEvents === undefined)
                                        return;
                                    repeat(eventListTemplate, ctx, customEvents.length, target);
                                    return {
                                        dt: ({ idx }) => ({
                                            span: customEvents[Math.floor(idx / 2)].name
                                        }),
                                        dd: ({ idx }) => ({
                                            h5: customEvents[Math.floor(idx / 2)].description,
                                            h6: {
                                                span: customEvents[Math.floor(idx / 2)].associatedPropName
                                            },
                                            details: {
                                                dl: ({ target, ctx }) => {
                                                    const detail = customEvents[Math.floor(idx / 2)].detail;
                                                    if (detail === undefined)
                                                        return;
                                                    repeat(definitionListTemplate, ctx, detail.length, target);
                                                    return {
                                                        dt: ({ idx }) => detail[Math.floor(idx / 2)].name,
                                                        dd: ({ idx }) => detail[Math.floor(idx / 2)].description
                                                    };
                                                }
                                            }
                                        })
                                    };
                                }
                            }
                        },
                        "section[data-type='properties']": {
                            details: {
                                dl: ({ target, ctx }) => {
                                    const props = tags[idx].properties;
                                    if (props === undefined)
                                        return;
                                    repeat(definitionListTemplate, ctx, props.length, target);
                                    return {
                                        dt: ({ idx }) => props[Math.floor(idx / 2)].name,
                                        dd: ({ idx }) => props[Math.floor(idx / 2)].description
                                    };
                                }
                            }
                        }
                    })
                };
            }
        });
        this._href = null;
        this._packageName = null;
        this._c = false;
    }
    get initContext() {
        return this._initContext;
    }
    static get is() {
        return "wc-info-base";
    }
    get noShadow() {
        return true;
    }
    get eventContext() {
        return {};
    }
    get ready() {
        return this._href !== undefined && this._packageName !== undefined;
    }
    init() {
        return new Promise(resolve => {
            fetch(this._href).then(resp => {
                resp.json().then(info => {
                    resolve(info);
                });
            });
        });
    }
    update() {
        return this.init();
    }
    onPropsChange() {
        this._initialized = false;
        this.root.innerHTML = "";
        return super.onPropsChange();
    }
    get mainTemplate() {
        return mainTemplate;
    }
    static get observedAttributes() {
        return super.observedAttributes.concat(["href", package_name]);
    }
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case "href":
                this._href = nv;
                break;
            case package_name:
                this._packageName = nv;
                break;
        }
        super.attributeChangedCallback(n, ov, nv);
    }
    get href() {
        return this._href;
    }
    set href(nv) {
        this.attr("href", nv);
    }
    get packageName() {
        return this._packageName;
    }
    set packageName(nv) {
        this.attr(package_name, nv);
    }
    connectedCallback() {
        this.propUp(["href", "packageName"]);
        super.connectedCallback();
    }
}
define(WCInfoBase);
