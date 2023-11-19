import { LitElement, css, html } from "lit"
import { customElement } from "lit/decorators.js"

@customElement('dir-button')
export class DirButton extends LitElement {
    static styles = css`
        :host {
            display: inline-block;
            --button-color: var(--yellow-medium);
            --button-color-hover: var(--yellow);
            --outline-color: var(--magenta-dark);
            --border-color: var(--magenta-dark);
            --button-background: var(--magenta-dark);
            --button-background-hover: var(--purple);
        }
        button {
            cursor: pointer;
            color: var(--button-color);
            outline-color: var(--button-outline-color);
            border: 1px solid var(--button-border-color);
            background: var(--button-background);
            box-sizing: border-box;
            border-radius:3px;
            border-width: 1px;
            padding: 0.5em 1em;
            transition: background .1s linear;
        }
        button:hover {
            background: var(--button-background-hover);
            color: var(--button-color-hover);
        }
        button:disabled {
            cursor: not-allowed;
            color: var(--disabled-color);
            outline-color: var(--primary-button);
            border-color: var(--primary-button);
            background: var(--disabled-background);	
        }
    `
    render() {
        return html`
            <button type="button">
                <slot>Btn</slot>
            </button>
        `
    }
}