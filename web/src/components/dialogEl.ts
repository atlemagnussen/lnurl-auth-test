import {LitElement, css, html, TemplateResult} from "lit"
import {customElement, property} from "lit/decorators.js"
import {ref, createRef, Ref} from "lit/directives/ref.js"
import {unsafeHTML} from "lit/directives/unsafe-html.js"
import {styleMap} from "lit/directives/style-map.js"
import { cloneDeep, merge } from "lodash-es"

interface DialogOptions {
    title: string
    okBtnText?: string
    cancelBtnText?: string
    hideOkBtn?: boolean
}

const defaultOptions: DialogOptions = {
    title: "Digilean dialog",
    okBtnText: "Ok",
    cancelBtnText: "Cancel",
    hideOkBtn: false
}

@customElement('dialog-el')
class DialogElement extends LitElement {

    private dialog: Ref<HTMLDialogElement> = createRef()
    private content: Ref<HTMLElement> = createRef()
    static styles = css`
        /* :host {
            
        } */
        * {
            box-sizing: border-box;
        }
        dialog {
            border: none !important;
            border-radius: 3px;
            box-shadow: 0 0 #83838300, 0 0 #83838300, 0 25px 50px -12px rgba(100, 100, 100, 1);
            background: var(--primary-background);
            color: white;
            padding: 0;
        }
        dialog #dialog-body {
            display: flex;
            flex-direction: column;
        }
        dialog #dialog-body section {
            flex: 1 1 auto;
        }
        dialog #dialog-body header {
            padding: 1rem;
        }
        dialog #dialog-body section {
            padding: 0 1rem 1rem 1rem;
        }
        dialog #dialog-body menu {
            padding: 1rem;
        }
        dialog #dialog-body header h4 {
            padding: 0;
            margin: 0;
            flex-grow: 1;
            color: var(--digilean-primary-text);
        }
        header button#cancel {
            appearance: none;
            background: 0 0;
            border: 0;
            color: var(--digilean-primary-text);
            cursor: pointer;
            opacity: 0.5;
            font-size: 1em;
        }
        header button#cancel:hover {
            opacity: 1;
        }
        dialog header {
            display: flex;
            flex-direction: row;
            border-bottom: 1px solid var(--digilean-grey-rain);
        }
        dialog section {
            border-bottom: 1px solid var(--digilean-grey-rain);
        }

        dialog menu {
            display: flex;
            gap: 1rem;
            flex-direction: row;
            justify-content: end;
            margin: 0;
        }
    `

    constructor() {
        super()
        this.addEventListener(DialogResult.dialogOkFromOutside, ((e: CustomEvent) => {
            this.ok(e.detail)
        })  as EventListener, { once: false, passive: true } )
    }
    // createRenderRoot() {
    //     return this
    // }

    keydown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            this.cancel()
        }
    }

    open() {
        this.dialog.value?.showModal()
    }

    cancel() {
        this.dispatchCustomEvent(DialogResult.dialogCancel, "cancel")
        this.dialog.value?.close()
        this.cleanup()
    }

    ok(data?: any) {
        this.dispatchCustomEvent(DialogResult.dialogOk, data)
        this.dialog.value?.close()
        this.cleanup()
    }
    cleanup() {
        this.body = "<p>digilean dialog</p>"
        this.bodyTemplate = null
        this.title = defaultOptions.title
        this.hideOkBtn = defaultOptions.hideOkBtn!
        let child = this.content.value?.lastElementChild
        while (child) {
            this.content.value?.removeChild(child)
            child = this.content.value?.lastElementChild
        }
    }
    
    dispatchCustomEvent(name: DialogResult, detail: any) {
        const options = { detail, bubbles: true, composed: true}
        this.dispatchEvent(new CustomEvent(name, options));
    }

    @property({attribute: true})
    header = ""
    

    @property({attribute: false})
    body = "<p>digilean dialog</p>"

    @property({attribute: false})
    bodyTemplate: TemplateResult<1> | null = null

    @property({attribute: true})
    okText = defaultOptions.okBtnText

    @property({attribute: true})
    cancelText = "cancel"
    
    @property({attribute: false})
    hideOkBtn = defaultOptions.hideOkBtn

    getSize() {
        return { minWidth: "90vw", minHeight: "90vh" }
    }
    render() {

        const dialogStyle = this.getSize()

        return html`
            <dialog ${ref(this.dialog)} @keydown=${(e: KeyboardEvent) => this.keydown(e)}>
                <div id="dialog-body" style=${styleMap(dialogStyle)}>
                    <header>
                        <h4>${unsafeHTML(this.title)}</h4>
                        <button type="button" id="cancel" @click=${() => this.cancel()}>×</button>
                    </header>
                    <section ${ref(this.content)}>
                        ${this.bodyTemplate == null ? 
                            html`${unsafeHTML(this.body)}` : 
                            this.bodyTemplate
                        }
                    </section>
                    <menu>
                        <dir-button @click=${() => this.cancel()}>${this.cancelText}</dir-button>
                        ${this.hideOkBtn ? html`` : 
                            html`<dir-button @click=${() => this.ok()}>${this.okText}</dir-button>`
                        }
                    </menu>
                </div>
            </dialog>
        `
    }
    appendElement(el: HTMLElement) {
        this.content.value?.appendChild(el)
    }
}

export enum DialogResult {
    dialogOk = "dialog-ok",
    dialogCancel = "dialog-cancel",
    dialogOkFromOutside = "dialog-ok-from-outside"
}

class DigiLeanDialog {
    private dialog: DialogElement
    
    constructor() {
        this.dialog = document.createElement("dialog-el") as DialogElement
        document.body.appendChild(this.dialog)
    }

    waitForClose(booleanRessult = false) {
        return new Promise((resolve, reject) => {
            this.dialog.addEventListener(DialogResult.dialogOk, ((e: CustomEvent) => {
                if (booleanRessult)
                    resolve(true)
                const data = e.detail
                resolve(data)
            }) as EventListener, { once: true})

            this.dialog.addEventListener(DialogResult.dialogCancel, ((e: CustomEvent) => {
                if (booleanRessult)
                    resolve(false)
                const data = e.detail
                reject(data)
            }) as EventListener, { once: true})
        })
    }
    
    openHtml(options: DialogOptions, template: string) {
        options = this.mergeOptions(options)
        this.setOptions(options)
        this.dialog.body = template
        this.dialog.open()
        return this.waitForClose(true)
    }
    openElement(options: DialogOptions, el: HTMLElement) {
        options = this.mergeOptions(options)
        this.setOptions(options)
        this.dialog.body = ""
        this.dialog.appendElement(el)
        this.dialog.open()
        return this.waitForClose(true) as Promise<boolean>
    }
    confirm(options: DialogOptions, template: string) {
        options = this.mergeOptions(options)
        this.setOptions(options)

        this.dialog.body = template
        
        this.dialog.open()
        return this.waitForClose(true) as Promise<boolean>
    }

    setOptions(options: DialogOptions) {
        const { okBtnText, cancelBtnText, title, hideOkBtn } = options
        this.dialog.okText = okBtnText
        this.dialog.cancelText = cancelBtnText!
        this.dialog.title = title
        if (hideOkBtn)
            this.dialog.hideOkBtn = hideOkBtn
    }
    mergeOptions(optionsIncoming: DialogOptions) {
        let options = cloneDeep(defaultOptions)
        if (optionsIncoming)
            options = merge(options, optionsIncoming)
        return options
    }
}

export default new DigiLeanDialog()