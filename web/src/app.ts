import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import type { ConfigFolder } from "@common/types"

import Dialog from "@app/components/dialogEl"

import "./dirHeader"
import "./components"
import "./vars.css"
import "./index.css"

@customElement('ln-auth')
export class LnAuthApp extends LitElement {
    static styles = css`
        :host {
            overflow: hidden;
            height: 100%;
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr auto;
            grid-template-areas:
                'header'
                'main'
                'footer';
        }
        * {
            box-sizing: border-box;
        }
        header {
            background: var(--secondary-background);
            grid-area: header;
            padding: 0.2rem;
            display: block;
            overflow: hidden;
        }

        main {
            overflow-x: hidden;
            overflow-y: auto;
            grid-area: main;
            padding: 0.5rem;
            display: block;
        }

        footer {
            grid-area: footer;
            max-width: 100vw;
            background: var(--secondary-background);
            padding: 0.2rem;
        }
        main::-webkit-scrollbar {
            width: 1em;
        }

        main::-webkit-scrollbar-track {
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        }

        main::-webkit-scrollbar-thumb {
            background-color: var(--magenta-dark);
            outline: 1px solid slategrey;
        }
    `

    @property({ attribute: false })
    config: ConfigFolder = {
        title: "LN Auth Test",
    }

    login() {
        Dialog.openHtml({
            title: "Login LN",
            hideOkBtn: true
        }, `<login-dialog class="dialog-fill"></login-dialog>`)
    }
    render() {
        return html`
            <header>
                <dir-header .title=${this.config.title}></dir-header>
            </header>

            <main>
                <p>Main Test</p>
                <p>
                    <button @click=${this.login}>Login</button>
                </p>
                <login-dialog></login-dialog>
            </main>


            <footer>
                <p>footer</p>
            </footer>

        `
  }
}
