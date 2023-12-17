import {LitElement, html, css} from "lit"
import {customElement, state} from "lit/decorators.js"
import { getCredentials } from "@app/services/waLogin"


@customElement('login-dialog-wa')
export class LoginDialogWa extends LitElement {
    
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

    async getLogin() {
        const login = await getCredentials()
        this.msg = JSON.stringify(login)
    }

    errorHandler(err:any) {
        this.msg = "error: " + err.message
    }

    @state()
    msg = ""

    connectedCallback(): void {
        super.connectedCallback()
    }
    render() {
        return html`
        <section class="wrapper">
            <header>
                <h1>Log in with WebAuthn</h1>
            </header>
            <p>
                <dir-button @click=${this.getLogin}></dir-button>
            </p>
        </section>
        `
    }
}
