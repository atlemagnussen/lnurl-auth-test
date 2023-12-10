import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"

@customElement('home-view')
export class HomeView extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: row;
            justify-content: center;
        }
        article {
            width: var(--default-width);
            max-width: var(--default-width);
        }
        a {
            color: var(--ln-purple);
        }
    `
    
    @property({attribute: false})
    test = ""

    render() {
        return html`
            <article>
                <header>
                    <h1>Welcome</h1>
                    <h2>To LN Test Auth</h2>
                </header>
                <section>
                    <p>
                        This app utilizes LNURL and specifically The <a href="https://github.com/lnurl/luds/blob/luds/04.md">LNURL-auth spec</a> 
                    </p>
                </section>
            </article>

        `
    }
}



