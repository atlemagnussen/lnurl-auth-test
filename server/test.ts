// import * as ln from "./src/ln"
import lnurl from "lnurl"
// import qrcodegen from "@common/thirdparty/qrcodegen.js"
import * as ln from "@lib/ln.js"

async function test() {
    const lnUrlEncoded = "LNURL1DP68GURN8GHJ7CT4W35ZUCN0D36ZUEN4DCHJUMN9W3KXJENE9AN82MNRW35K7MNN9AKX7EMFDCLHGCT884KX7EMFDCNXKVFAXSMXXD3NXCENWDP5XUERQDE3VCMRSDM98YCNYCTXXDNRYCFJVVUNWVRYX5MNJDRP8QCXXDFHVEJNVVNXXUURSVPHVCMRVCM9X5CRYDCCMPVD2"

    const url = lnurl.decode(lnUrlEncoded)
    console.log(url)

    const k1 = ln.generateK1()
    console.log(k1)

    //const jwt = await ln.signJWT()
    //const k1 = await ln.generateK1()
    //console.log(k1)
}

// function create(input: string) {
//     const QRC = qrcodegen.QrCode;

//     // Simple operation
//     const qr0 = QRC.encodeText(input, QRC.Ecc.MEDIUM)
//     return qr0
// }
test().catch(err => {
    console.error(err)
})