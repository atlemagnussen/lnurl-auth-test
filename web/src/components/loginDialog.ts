import {LitElement, html, css} from "lit"
import {customElement, state} from "lit/decorators.js"

import { getLnLoginUrl } from "@app/services/lnLogin"

@customElement('login-dialog')
export class LoginDialog extends LitElement {
    
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            height: 100%;
            flex-grow: 1;
            background: blue;
        }
        .full {
            flex: 1 1 auto;
        }
    `


    sendChangeEvent() {
        const changeEvent = new Event("change", {
            bubbles: true,
            composed: true
        })
        this.dispatchEvent(changeEvent)
    }

    
    async getLnAuth() {
        const data = await getLnLoginUrl()
        const dataStr = JSON.stringify(data, null, 2)
        this.data = dataStr
    }

    @state()
    data = ""

    render() {
        // const classes = {
        //     "checked": this.checked
        // }
        
        return html`
            <div>
                <button @click=${this.getLnAuth}>Get Auth url</button>
            </div>
            
            <textarea class="full" .value=${this.data}>
            </textarea>
        `
    }
}
