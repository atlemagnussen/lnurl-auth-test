import backendHttp from "@app/stores/backendHttp"
import * as qrCode from "@common/qrCode"
import type { LoginUrlResponse } from "@common/types"

export function getLnLoginUrl() {
    const url = "login-url"
    return backendHttp.get<LoginUrlResponse>(url)
}

export function createQr(input: string) {
    const qr = qrCode.create(input)
    const qrSvg = qrCode.toSvgString(qr, 2, "#FFF", "#333")
    return qrSvg
}