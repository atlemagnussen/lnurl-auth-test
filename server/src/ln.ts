import lnurl from "lnurl"
import secp256k1 from "secp256k1"
import { bech32 } from "bech32"
import crypto from "crypto"

const algorithm = "sha256"
const hostname = "localhost"
const k1 = "pvg57666"

export const generateAuthUrl = () => {
    const url = `http://${hostname}/api/login?tag=login&k1=${k1}`

    let digest1 = crypto.createHash(algorithm).update(k1).digest("hex") 
  
    let digest2 = crypto.createHash(algorithm).update(k1).digest("base64")

    return {
        url, digest1, digest2
    }
}

// function encode(url: string) {
//     const test = lnurl.encode(url)

//     secp256k1.ecdsaVerify()


//     bech32.encode()

//     return test
// }