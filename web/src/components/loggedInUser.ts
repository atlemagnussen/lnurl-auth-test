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
        
        return html`
        <section class="wrapper">
            <h1>You are logged in</h1>
            <p>
                userId: ${this.user?.iss}
            </p>
            <p>
                Issued: ${this.parseTokenDate(this.user?.iat)}
            </p>
            <p>
                Expires: ${this.parseTokenDate(this.user?.exp)}
            </p>
        </section>
        `
    }
}
