import {LitElement, html, css} from "lit"
import {customElement, state} from "lit/decorators.js"
import {unsafeHTML} from "lit/directives/unsafe-html.js"

import { getLnLoginUrl, createQr, isLoggedIn } from "@app/services/lnLogin"
import backendHttp from "@app/stores/backendHttp"

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
        this.sessionToken = data.sessionToken

        const qr = createQr(data.encodedUrl)
        this.qrSvg = qr
    }

    async isLoggedIn() {
        if (!this.sessionToken) {
            this.msg = "no session token yet"
            return
        }
        this.msg = ""
        const data = await isLoggedIn(this.sessionToken)
        this.msg = JSON.stringify(data)
    }

    async protectedCall() {
        const data = await backendHttp.get("protected")
        this.msg = JSON.stringify(data)
    }
    @state()
    url = ""

    @state()
    qrSvg = ""

    @state()
    msg = ""

    sessionToken = ""

    render() {
        
        return html`
            <div>
                <button @click=${this.getLnAuth}>Get Auth url</button>
            </div>
            
            <div>
                ${this.url}<br>
                <button @click=${this.isLoggedIn}>Check is logged in</button>
                <button @click=${this.protectedCall}>test protected call</button>
            </div>

            <div class="error">
                ${this.msg}
            </div>
            <div>
                ${unsafeHTML(this.qrSvg)}
            </div>
        `
    }
}
