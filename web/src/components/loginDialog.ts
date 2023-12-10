import {LitElement, html, css} from "lit"
import {customElement, state} from "lit/decorators.js"
import {unsafeHTML} from "lit/directives/unsafe-html.js"
import { getAuthUser } from "@app/stores/authUser"
import { getLnLoginUrl, createQr, isLoggedIn } from "@app/services/lnLogin"

@customElement('login-dialog')
export class LoginDialog extends LitElement {
    
    static styles = css`
        :host {
            display: flex;
            flex-direction: row;
            justify-content: center;
            flex-grow: 1;
        }
        .wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 1rem;
            width: var(--default-width);
            max-width: var(--default-width);
            background: black;
        }
        .qr-code {
            width: 80%;
        }
        .wrap-anywhere {
            overflow-wrap: anywhere;
        }
        a {
            color: white;
        }
        @media only screen and (max-width: 640px) {
            .wrapper {
                width: 100%;
                max-width: 100%;
            }
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
            // this.encoded = data.encodedUrl
            this.urlLnScheme = data.urlLnScheme

            this.sessionToken = data.sessionToken
    
            const qr = createQr(data.urlLnScheme)
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
        getAuthUser()
    }

    errorHandler(err:any) {
        this.msg = "error: " + err.message
    }
    
    @state()
    url = ""

    @state()
    encoded = ""

    @state()
    urlLnScheme = ""

    @state()
    qrSvg = ""

    @state()
    msg = ""

    sessionToken = ""

    render() {
        
        return html`
        <section class="wrapper">
            <div>
                <button @click=${this.getLnAuth}>Get Auth url</button>
            </div>
            
            <div class="wrap-anywhere">
                ${this.url}<br><br>
                ${this.urlLnScheme}<br><br>
                ${this.urlLnScheme ? html`<a href="${this.urlLnScheme}">LnUrl Auth scheme</a><br><br>` : ""}
                
                <button @click=${this.isLoggedIn}>Check is logged in</button>
            </div>

            <div class="wrap-anywhere">
                ${this.msg}
            </div>
            <div class="qr-code">
                ${unsafeHTML(this.qrSvg)}
            </div>
        </section>
        `
    }
}
