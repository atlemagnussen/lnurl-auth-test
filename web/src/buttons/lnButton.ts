import { LitElement, css, svg } from "lit"
import { customElement } from "lit/decorators.js"

@customElement('ln-button')
export class LnButton extends LitElement {
    static styles = css`
        :host {
            display: inline-flex;
            justify-content: center;
            overflow: none;
            height: var(--button-height, 4rem);
            width: var(--button-width, 4rem);
            --button-color: var(--peach);
            cursor: pointer;
        }
        svg {
            width: 100%;
            height: 100%;
        }
        .lightning {
            fill: var(--button-color);
        }
    `
    
    render() {
        
        return svg`
            <svg width="282" height="282" viewBox="0 0 282 282" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0)">
                <circle cx="140.983" cy="141.003" r="141" class="lightning" />
                <path d="M79.7609 144.047L173.761 63.0466C177.857 60.4235 181.761 63.0466 179.261 67.5466L149.261 126.547H202.761C202.761 126.547 211.261 126.547 202.761 133.547L110.261 215.047C103.761 220.547 99.261 217.547 103.761 209.047L132.761 151.547H79.7609C79.7609 151.547 71.2609 151.547 79.7609 144.047Z" fill="white"/>
            </g>
            <defs>
                <clipPath id="clip0">
                    <rect width="282" height="282" fill="white"/>
                </clipPath>
            </defs>
            </svg>
        `
    }
}



