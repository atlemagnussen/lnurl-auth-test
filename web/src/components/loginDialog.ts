import {LitElement, html, css} from "lit"
import {customElement, state} from "lit/decorators.js"
import {unsafeHTML} from "lit/directives/unsafe-html.js"
// import { getAuthUser } from "@app/stores/authUser"
import { getLnLoginUrl, createQr } from "@app/services/lnLogin"
// import { navigateTo } from "@app/routes"

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
            align-items: center;
            gap: 1rem;
            width: var(--default-width);
            max-width: var(--default-width);
            background: black;
            padding: 0.5rem;
        }
        .qr-code {
            width: 80%;
            max-width: 400px;
        }
        .wrap-anywhere {
            overflow-wrap: anywhere;
        }
        a {
            color: white;
        }
        ln-button {
            --button-color: var(--ln-blue);
            --button-width: 5rem;
            --button-height: 5rem;
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
    
            const qr = createQr(data.urlLnScheme)
            this.qrSvg = qr
        }
        catch(e) { this.errorHandler(e) }
    }

    async isLoggedIn() {
        const evtSource = new EventSource("is-logged-in")

        evtSource.onmessage = (e) => {
            console.log(e)
        }
        evtSource.addEventListener("connected", (e) => {
            console.log(e)
        })
        evtSource.addEventListener("authenticated", (e) => {
            console.log(e)
            this.msg += e.data + "<br>"

            evtSource.close()
        })
        // this.msg = ""
        // const data = await isLoggedIn(this.sessionToken).catch(this.errorHandler)
        // this.msg = JSON.stringify(data)
        // getAuthUser().then(u => {
        //     if (u && u.sub)
        //         navigateTo("/profile")
        // })
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

    connectedCallback(): void {
        super.connectedCallback()
        this.getLnAuth()
    }
    render() {
        return html`
        <section class="wrapper">
            <header>
                <h1>Log in with LNURL-auth</h1>
            </header>
            <div>
                <dir-button @click=${this.getLnAuth}>Get a new Auth url</dir-button>
            </div>
            
            <!-- <div class="wrap-anywhere">
                ${this.url}<br><br>
                ${this.urlLnScheme}<br><br>
            </div> -->

            ${this.urlLnScheme ? html`
                <a href="${this.urlLnScheme}">
                    <figure>
                        <ln-button></figure>
                        <figcaption>Click here or scan QR</figcaption>
                    </figure>
                </a><br>
            ` : ""}

            <dir-button @click=${this.isLoggedIn}>Check is logged in</dir-button>

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
