import {LitElement, html, css} from "lit"
import {customElement, state} from "lit/decorators.js"
import {unsafeHTML} from "lit/directives/unsafe-html.js"

import { getLnLoginUrl, createQr } from "@app/services/lnLogin"

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
        this.url = data.url

        const qr = createQr(data.encodedUrl)
        this.qrSvg = qr
    }

    @state()
    url = ""

    @state()
    qrSvg = ""

    render() {
        
        return html`
            <div>
                <button @click=${this.getLnAuth}>Get Auth url</button>
            </div>
            
            <p>${this.url}</p>
            <!-- <textarea class="full" .value=${this.data}>
            </textarea> -->

            <div>
                ${unsafeHTML(this.qrSvg)}
            </div>
        `
    }
}
