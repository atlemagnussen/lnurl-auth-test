import {LitElement, html, css} from "lit"
import {customElement, state} from "lit/decorators.js"
import * as formatter from "@app/services/dateFormatter"


@customElement('datetime-viewer')
export class DateTimeViewer extends LitElement {
    
    static styles = css`
        :host {
            display: inline;
        }
    `

    _date: string | number | undefined = ""
    set date(value: string | number | undefined) {
        if (!value) {
            this._date = ""
            this.dateStr = ""
            return
        }
        
        this._date = value
        this.dateStr = formatter.formatDateTimeLong(this._date)
    }

    get date() {
        return this._date
    }
    

    @state()
    dateStr = ""

    render() {
        return html`${this.dateStr}`
    }
}
