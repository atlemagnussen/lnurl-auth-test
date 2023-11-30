//import lnurl from "lnurl"
//import secp256k1 from "secp256k1"
//import { bech32 } from "bech32"
import crypto from "crypto"
import * as jose from "jose"

const hashAlg = "sha256"
const signAlg = "HS256"
const secret = new TextEncoder().encode("cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2")

const hostname = "localhost"
const k1 = "pvg57666"

export const generateAuthUrl = () => {
    const url = `http://${hostname}/api/login?tag=login&k1=${k1}`

    let digest1 = crypto.createHash(hashAlg).update(k1).digest("hex") 
  
    let digest2 = crypto.createHash(hashAlg).update(k1).digest("base64")

    return {
        url, digest1, digest2
    }
}

export const signJWT = async () => {

    const d = generateAuthUrl()

    console.log("payload")
    const payload = {
        "urn:example:claim": true,
        hash: d.digest2
    }
    const jwt = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: signAlg })
        .setIssuedAt()
        .setIssuer('urn:example:issuer')
        .setAudience('urn:example:audience')
        .setExpirationTime('2h')
        .sign(secret)

  return jwt
}

// function encode(url: string) {
//     const test = lnurl.encode(url)

//     secp256k1.ecdsaVerify()


//     bech32.encode()

//     return test
// }