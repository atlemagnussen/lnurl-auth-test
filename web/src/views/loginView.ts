import {LitElement, html, css} from "lit"
import {customElement, state} from "lit/decorators.js"
import { LoginMethods, authUser, logOut } from "@app/stores/authUser"
import { AuthUserToken } from "@common/types"
import { Subscription } from "rxjs"


@customElement('login-view')
export class LoginView extends LitElement {
    
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

    @state()
    loginMethod: LoginMethods | null = null

    @state()
    user: AuthUserToken | null = null

    sub: Subscription | null = null

    connectedCallback(): void {
        super.connectedCallback()
        this.sub = authUser.subscribe(u => {
            this.user = u
        })
    }
    disconnectedCallback(): void {
        super.disconnectedCallback()
        if (this.sub)
            this.sub.unsubscribe()
        this.loginMethod = null
    }

    openLoginFor(method: LoginMethods) {
        this.loginMethod = method
    }
    renderSelector() {
        return html`
            <header>
                <h1>Log in</h1>
            </header>
            <p>
                <dir-button @click=${() => this.openLoginFor("lnurl-auth")}>With LNURL-Auth</dir-button>
            </p>
            <p>
                <dir-button @click=${() => this.openLoginFor("webauthn")}>With WebAuthn</dir-button>
            </p>
            <p>
                <dir-button @click=${logOut}>Log out</dir-button>
            </p>
        `
    }
    render() {

        let view = this.renderSelector()
        if (this.user?.sub)
            view = html`<user-profile-view></user-profile-view>`

        else if (this.loginMethod == "lnurl-auth")
            view = html`<login-dialog-ln></login-dialog-ln>`

        else if (this.loginMethod == "webauthn")
            view = html`<login-dialog-wa></login-dialog-wa>`

        return html`
            <section class="wrapper">
                ${view}
            </section>
        `
    }
}
