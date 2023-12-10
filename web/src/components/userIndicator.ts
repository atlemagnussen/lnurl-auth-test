import { authUser } from "@app/stores/authUser"
import { AuthUserToken } from "@common/types"
import {LitElement, html, css} from "lit"
import {customElement} from "lit/decorators.js"
import { Subscription } from "rxjs"
import { classMap } from "lit/directives/class-map.js"

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

    user: AuthUserToken | null = null
    sub: Subscription | null = null

    connectedCallback(): void {
        super.connectedCallback()
        this.sub = authUser.subscribe(u => this.user = u)
    }
    
    render() {

        const loggedin = this.user?.iss!!
        

        if (loggedin) {
            return html`
            <ln-button class="loggedin"></ln-button>
        `
        }
        else {
            return html`<ln-button></ln-button>`
        }
    }
}
