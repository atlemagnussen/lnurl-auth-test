import {LitElement, html, css} from "lit"
import {customElement, property} from "lit/decorators.js"
import { classMap } from "lit/directives/class-map.js"

@customElement('au-checkbox')
export class AuCheckbox extends LitElement {
    private internals: ElementInternals
    static styles = css`
        :host {
            display: block;
            line-height:1.5em;
            --switch-size:1em;
            --switch-border-width:0.1875em;
            --switch-border-inner-radius:calc(var(--switch-size) / 2);
            --switch-border-outer-radius:calc(var(--switch-border-inner-radius) + var(--switch-border-width));
        }
        div {
            appearance:none;
            display:inline-block;
            vertical-align:middle;
            padding:0 var(--switch-size) 0 0;
            background:#949494;
            border:var(--switch-border-width) solid #008;
            border-radius:var(--switch-border-outer-radius);
            transition:background 0.3s, padding 0.3s;
        }
        div:before {
            content:"";
            display:block;
            width:var(--switch-size);
            height:var(--switch-size);
            background:#FFF;
            border-radius:var(--switch-border-inner-radius);
            transition:background 0.3s;
        }
        div.checked {
            padding:0 0 0 var(--switch-size);
            background:#17D;
        }
        div.checked:before {
	        background:#8CF;
        }
    `

    constructor() {
        super()
        this.internals = this.attachInternals()
    }
    connectedCallback(): void {
        super.connectedCallback()
        this.addEventListener("click", this.onclickCb)
    }

    disconnectedCallback(): void {
        super.disconnectedCallback()
        this.removeEventListener("click", this.onclickCb)
    }
    onclickCb() {
        this.checked = !this.checked
        this.sendChangeEvent()
        ///@ts-ignore
        this.internals.setFormValue(this.checked)
    }
    static formAssociated = true

    @property({attribute: true})
    name = ""

    get form() {
        ///@ts-ignore
        return this.internals.form
    }
    
    get type() { return "au-checkbox" }

    get checked() { return this.hasAttribute('checked') }
    set checked(flag) {
        this.toggleAttribute('checked', Boolean(flag))
        this.requestUpdate()
    }

    sendChangeEvent() {
        const changeEvent = new Event("change", {
            bubbles: true,
            composed: true
        })
        this.dispatchEvent(changeEvent)
    }
    render() {
        const classes = {
            "checked": this.checked
        }
        
        return html`
            <div class=${classMap(classes)}></div>
        `
    }
}
