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
        .qr-code {
            width: 20vw;
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
        try {
            const data = await getLnLoginUrl()
            this.url = data.url
            this.sessionToken = data.sessionToken
    
            const qr = createQr(data.encodedUrl)
            this.qrSvg = qr
        }
        catch(e) { this.errorHandler(e) }
    }

    async isLoggedIn() {
        if (!this.sessionToken) {
            this.msg = "no session token yet"
            return
        }
        this.msg = ""
        const data = await isLoggedIn(this.sessionToken).catch(this.errorHandler)
        this.msg = JSON.stringify(data)
    }

    errorHandler(err:any) {
        this.msg = "error: " + err.message
    }
    async protectedCall() {
        try {
            const data = await backendHttp.get("protected")
            this.msg = JSON.stringify(data)
        }
        catch(e) { this.errorHandler(e) }
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
            <div class="qr-code">
                ${unsafeHTML(this.qrSvg)}
            </div>
        `
    }
}
