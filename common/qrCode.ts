
import qrcodegen from "@common/thirdparty/qrcodegen"


export function create(input: string) {
    const QRC = qrcodegen.QrCode;

    // Simple operation
    const qr0 = QRC.encodeText(input, QRC.Ecc.MEDIUM)
    return qr0
}