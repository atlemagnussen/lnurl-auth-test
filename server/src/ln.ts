

import lnurl from "lnurl"
import cookie from "cookie"
import crypto from "crypto"
import * as jose from "jose"
import type { Action, LoginUrlResponse, SavedUser } from "../../common/types.js"
import config from "./config.js"

const users: SavedUser[] = []

const hashAlg = "sha256"
const signAlg = "HS256"
const JWTsecret = new TextEncoder().encode("cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2")

const generateAuthUrl = (protocol: string, k1: string, action: Action = "login") => {
    
    let url = `${protocol}://${config.hostname}`
    if (config.portInLnLink)
        url += `:${config.port}`
    url += `/login?tag=login&k1=${k1}&action=${action}`
    return url
}

export async function getLoginUrl(protocol: string, action: Action = "login"): Promise<LoginUrlResponse> {
    const k1 = await generateK1()
    const url = generateAuthUrl(protocol, k1, action)
    const urlLnScheme = url.replace("http://", "keyauth://")
    const hash = createHash(k1)

    const sessionToken = await signSessionToken({ hash})

    users.push({k1, hash})

    return {
        url,
        encodedUrl: lnurl.encode(url).toUpperCase(),
        urlLnScheme,
        k1,
        hash,
        sessionToken
    }
}

export async function verifySessionToken(sessionToken: string) {
    const verification = await jose.jwtVerify(
        sessionToken,
        Buffer.from(JWTsecret), { algorithms: [signAlg] }
    )
    return verification
}

export async function signJWT(payload: any) {
    const jwt = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: signAlg })
            .setIssuedAt()
            .setIssuer('urn:example:issuer')
            .setAudience('urn:example:audience')
            .setExpirationTime('2h')
            .sign(JWTsecret)
    return jwt
}
export async function signSessionToken(payload: any) {
    const sessionToken = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: signAlg })
        .setIssuedAt()
        .setExpirationTime("5min")
        .sign(JWTsecret)
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
    const found = users.find(u => u.hash == hash)
    return found
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
        throw new Error("Could not create unique k1")
    
    return k1
}

export function assignUserKeyJwt(k1: string, key: string, jwt: string) {
    const user = users.find(u => u.k1 == k1)
    if (!user)
        throw new Error("User not found")

    console.log(`Assigned ${key} and ${jwt}`)
    user.key = key
    user.jwt = jwt
}

export function findUserByHash(hash: string) {
    const user = users.find(u => u.hash == hash)
    return user
}

export async function extractTokenFromCookie(cookieHeader?: string) {
    console.log("cookieHeader", cookieHeader)
    
    if (!cookieHeader)
        throw new Error("no cookie")

    const cookies = cookie.parse(cookieHeader)
    const token = cookies.Authorization;
    if (!token)
        throw new Error("No Authorization in cookie")

    try {
        const verification = await jose.jwtVerify(token, Buffer.from(JWTsecret), {
            algorithms: [signAlg]
        })
        const { payload } = verification
        return payload
    } catch (error) {
        throw new Error("Could not verify jwt in cookie")
    }
}