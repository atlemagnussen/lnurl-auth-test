export type Action = "register" | "login" | "link" | "auth"

import lnurl from "lnurl"
//import secp256k1 from "secp256k1"
//import { bech32 } from "bech32"
import crypto from "crypto"
import * as jose from "jose"

const hashAlg = "sha256"
const signAlg = "HS256"
const secret = new TextEncoder().encode("cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2")

const hostname = "localhost"
const k1Default = "cb2a5410e50c6cc3dc1cd62c30ae0e0d735be4a75a703e111f75e0d9179e513e"

const generateAuthUrl = (k1: string, action: Action = "login") => {
    const url = `http://${hostname}/login?tag=login&k1=${k1}&action=${action}`
    return url
}


export async function getLoginUrl(action: Action = "login") {
    const k1 = await generateK1()
    const url = generateAuthUrl(k1, action)
    const k1Hash = createHash(k1)

    const session_token = await signSessionToken({ hash: k1Hash})
    return {
        url,
        encoded: lnurl.encode(url).toUpperCase(),
        secret: k1,
        secretHash: k1Hash,
        session_token
    }
}


export async function signJWT(payload: any) {
    const jwt = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: signAlg })
            .setIssuedAt()
            .setIssuer('urn:example:issuer')
            .setAudience('urn:example:audience')
            .setExpirationTime('2h')
            .sign(secret)
    return jwt
}
export async function signSessionToken(payload: any) {
    const sessionToken = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: signAlg })
        .setIssuedAt()
        .setExpirationTime("5min")
        .sign(secret)
    return sessionToken
}

function createHash(data: string | Buffer) {
    if (typeof data === "string")
        data = Buffer.from(data, "hex")
    
    //     crypto.createHash(hashAlg).update(k1).digest("base64")
    return crypto.createHash(hashAlg).update(data).digest("hex")
}

export async function verifySig(sig: string, k1: string, key: string) {
    if (!lnurl.verifyAuthorizationSignature(sig, k1, key)) {
       throw new Error("Signature verification failed")
    }
    const hash = createHash(k1);
    const hashExist = await isHashUsed(hash)
    if (!hashExist)
        throw new Error("Provided k1 is not issued by server")
    return { key, hash }
}

async function isHashUsed(hash: string) {
    return true
}

export async function generateK1() {
    let k1 = null
    const maxAttempts = 5
    let attempt = 0
    while (k1 === null && attempt < maxAttempts) {
        k1 = crypto.randomBytes(32).toString("hex")
        const hash = createHash(k1)
        const isUsed = await isHashUsed(hash)
        if (isUsed) {
            k1 = null
        }
        attempt++
    }
    if (!k1)
        return k1Default
    
    return k1
}
// function encode(url: string) {
//     const test = lnurl.encode(url)

//     secp256k1.ecdsaVerify()


//     bech32.encode()

//     return test
// }