import path from "path"
import express from "express"
import bodyParser from "body-parser"
import config from "./config.js"
import * as ln from "./ln.js"
import type { Action, ErrorResponse } from "../../common/types.js"

const app = express()
app.use(bodyParser.json()) 

const rootFolder = process.cwd()
console.log("rootFolder", rootFolder)
const web = path.resolve("..", "web/dist")
console.log("web", web)
const webIndex = path.resolve(web, "index.html")

app.use(express.static(web))

/**
 * 1. User requests a LNURL AUTH URL
 *  Web client will present as a QR code
 *  We also return a 5min long session token
 */
app.get("/login-url", async (req, res) => {
    const action = req.query.action ?? "login"
    console.log(`login-url:: protocol=${req.protocol}, action=${action}`)

    try {
        const loginUrlData = await ln.getLoginUrl(req.protocol, action as Action)
        console.log("baseurl created: ", loginUrlData.url)
        return res.status(200).json(loginUrlData)

    } catch (error: any) {
        const errRes: ErrorResponse = {
            reason: "Unexpected error happened: " + error.message
        }
        res.status(500).json(errRes)
    }
})

/**
 * 2. When LN Wallet scans QR it will sign and pass on the signature along with the k1 into this endpoint
 * We verify the signature and that the k1 originated from us
 * key will be the unique ID for the now authenticated user
 * We create a new auth token and sign it
 */
app.get("/login", async (req, res) => {
    try {
        const { tag, k1, sig, key } = req.query;

        console.log("login::req.query=", req.query)

        const verifiedSig = await ln.verifySig(sig as string, k1 as string, key as string)
        
        console.log(verifiedSig)

        const jwt = await ln.signJWT({ sub: key, idp: "LNURL-auth" })
        
        ln.assignUserKeyJwt(k1 as string, key as string, jwt)

        return res.status(200).json({ status: "OK" })

    } catch(error: any) {
        console.error(error.message)
        const errRes: ErrorResponse = {
            reason: error.message
        }
        return res.status(400).json(errRes)
    }
})

/**
 * 3. The web client must check if the user´s LN wallet has authenticated yet
 * (should be possible to solve by sending the web client an event)
 * The session token from 1. will be validated, if OK the auth token will be set as a cookie
 */
app.get("/is-logged-in", async (req, res) => {
    const sessionToken = req.headers.sessiontoken as string

    if (!sessionToken)
        return res.json({loggedIn: false, reason: "no session token"})

    try {
        const verification = await ln.verifySessionToken(sessionToken)
        console.log("verification", verification)

        const hash = verification.payload.hash
        if (hash) {
            const user = ln.findUserByHash(hash as string)
            if (user && user.jwt) {
    
                return res.status(200)
                .set("Cache-Control", "no-store")
                .cookie("Authorization", user.jwt, {
                    maxAge: 24 * 60 * 60 * 1000,
                    secure: false,
                    httpOnly: true,
                    sameSite: "lax",
                })
                .header('Access-Control-Allow-Origin', serverUrl)
                .header("Access-Control-Allow-Credentials","true")
                .json({ loggedIn: true })
            }   
        }
    }
    catch (error: any) {
        console.error(error)
        if (error.reason) {
            const errRes: ErrorResponse = { reason: error.reason}
            if (error.code == "ERR_JWT_EXPIRED")
                errRes.reason += ". Login link expired"
            
            return res.status(400).json(errRes)
        }
    }
    return res.json({loggedIn: false, msg: "Could not find user"})
})

/**
 * 4. User can call a protected resource
 * Verify the token in the cookie and extract the userid/key/sub
 * 
 */
app.get("/logged-in-user", async function (req, res) {

    const cookie = req.headers.cookie
    try {
        const authToken = await ln.extractTokenFromCookie(cookie)
        console.log(authToken)
        return res.json(authToken)
    }
    catch (error: any) {
        console.log(error.message)
        const errRes: ErrorResponse = {
            reason: error.message
        }
        return res.status(400).json(errRes)
    }
})

app.get("*", function (req, res) {
    res.sendFile(webIndex)
})

let port = config.port ? config.port : 5000
const serverUrl = `http://${config.hostname}:${port}`
app.listen(port, '0.0.0.0', () => {
    console.log(`[server]: Server is running at ${serverUrl}`)
})
