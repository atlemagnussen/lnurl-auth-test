import {LitElement, html, css} from "lit"
import {customElement, state} from "lit/decorators.js"
import { authUser } from "@app/stores/authUser"
import { AuthUserToken } from "@common/types"
import { Subscription } from "rxjs"


@customElement('logged-in-user')
export class LoggedInUser extends LitElement {
    
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
    user: AuthUserToken | null = null

    sub: Subscription | null = null

    connectedCallback(): void {
        super.connectedCallback()
        this.sub = authUser.subscribe(u => this.user = u)
    }
    disconnectedCallback(): void {
        super.disconnectedCallback()
        if (this.sub)
            this.sub.unsubscribe()
    }

    parseTokenDate(epoch?: number) {
        if (!epoch)
            return new Date().toISOString()

        const date = new Date(epoch * 1000)
        return date.toISOString()
    }
    render() {
        
        const iat = this.user ? this.user.iat * 1000 : 0
        const exp = this.user ? this.user.exp * 1000 : 0

        return html`
        <section class="wrapper">
            <h1>You are logged in</h1>
            <p class="wrap-anywhere">
                userId: ${this.user?.sub}
            </p>
            <p>
                Issuer: ${this.user?.iss}, Idp: ${this.user?.idp}
            </p>
            <p>
                Issued: <datetime-viewer .date=${iat}></datetime-viewer>
            </p>
            <p>
                Expires: <datetime-viewer .date=${exp}></datetime-viewer>
            </p>
        </section>
        `
    }
}
