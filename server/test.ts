// import * as ln from "./src/ln"
import lnurl from "lnurl"
import * as qr from "@common/"

async function test() {

    const lnUrlEncoded = "LNURL1DP68GURN8GHJ7CT4W35ZUCN0D36ZUEN4DCHJUMN9W3KXJENE9AN82MNRW35K7MNN9AKX7EMFDCLHGCT884KX7EMFDCNXKVFAXSMXXD3NXCENWDP5XUERQDE3VCMRSDM98YCNYCTXXDNRYCFJVVUNWVRYX5MNJDRP8QCXXDFHVEJNVVNXXUURSVPHVCMRVCM9X5CRYDCCMPVD2"

    const url = lnurl.decode(lnUrlEncoded)
    console.log(url)

    const qrCode = qr.create("Hello world")
    console.log(qrCode)

    //const jwt = await ln.signJWT()
    //const k1 = await ln.generateK1()
    //console.log(k1)
}

test().catch(err => {
    console.error(err)
})