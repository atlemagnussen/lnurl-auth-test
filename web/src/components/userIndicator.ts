import { authUser } from "@app/stores/authUser"
import { AuthUserToken } from "@common/types"
import {LitElement, html, css} from "lit"
import {customElement, state} from "lit/decorators.js"
import { Subscription } from "rxjs"

@customElement('user-indicator')
export class UserIndicator extends LitElement {
    
    static styles = css`
        :host {
            display: inline-flex;
            justify-content: center;
            overflow: none;
            height: var(--button-height, 4rem);
            width: var(--button-width, 4rem);
        }

        .loggedin {
            --button-color: var(--ln-purple);
        }
    `

    @state()
    user: AuthUserToken | null = null

    sub: Subscription | null = null

    connectedCallback(): void {
        super.connectedCallback()
        this.sub = authUser.subscribe(u => this.user = u)
    }
    
    render() {

        const loggedin = this.user?.iss!!
        
        this.title = loggedin ? "Logged in" : "Not logged in"
        if (loggedin) {
            return html`
                <a href="profile">
                    <ln-button class="loggedin"></ln-button>
                </a>
            `
        }
        else {
            return html`
                <a href="login">
                    <ln-button></ln-button>
                </a>
            `
        }
    }
}
