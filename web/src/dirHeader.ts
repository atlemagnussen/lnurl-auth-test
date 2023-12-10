import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import dialog from "@app/components/dialogEl"

@customElement('dir-header')
export class DirHeader extends LitElement {
    static styles = css`
        :host {
            display: flex;
            justify-content: center;
            max-width: 100%;
            width: 100%;
            overflow-y: hidden;
            overflow-x: auto;
        }
        .wrapper {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            width: var(--default-width);
            max-width: var(--default-width);
        }
        h1 {
            flex: 1 1 auto;
            color: var(--headline-color);
            font-size: 1.6rem;
            margin-block-start: 0;
            margin-block-end: 0;
        }
        
        @media only screen and (max-width: 640px) {
            .wrapper {
                width: 100%;
                max-width: 100%;
            }
            h1 {
                font-size: 1.1rem;
            }
        }
        home-button, user-indicator {
            --button-height: 3rem;
            --button-width: 3rem;
        }
    `
    
    @property({attribute: true})
    title = ""
    
    openSearchDialog() {
        dialog.openHtml({
            title: "Search",
            hideOkBtn: true,
            cancelBtnText: "Close"
        }, "<search-view></search-view>")
    }


    render() {
        const title = decodeURI(this.title)
        document.title = title
        return html`
            <div class="wrapper">
                <a href="/">
                    <home-button></home-button>
                </a>
                <h1>${title}</h1>
                <user-indicator></user-indicator>
            </div>
        `
    }
}
