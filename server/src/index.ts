import path from "path"
import express from "express"
import bodyParser from "body-parser"
import config from "./config.js"
import * as ln from "./ln.js"
import type { Action, ErrorResponse } from "../../common/types.js"
import { sessionCookie, getSessionId, sendLoggedInEvents } from "./session.js"

let sessionRes: Record<string, express.Response> = {}

const app = express()
app.use(bodyParser.json()) 

const rootFolder = process.cwd()
console.log("rootFolder", rootFolder)
const web = path.resolve("..", "web/dist")
console.log("web", web)
const webIndex = path.resolve(web, "index.html")

app.use(express.static(web))
app.use(sessionCookie)

/**
 * 1. User requests a LNURL AUTH URL
 *  Web client will present as a QR code
 *  We also return a 5min long session token
 */

app.get("/login-url", async (req, res) => {
    const action = req.query.action ?? "login"
    console.log(`login-url:: protocol=${req.protocol}, action=${action}`)

    const sessionId = getSessionId(req) as string
    console.log("sessionId", sessionId)

    try {
        const loginUrlData = await ln.getLoginUrl(req.protocol, sessionId, action as Action)
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
app.get("/login-ln", async (req, res) => {
    try {
        const tag = req.query.tag as string
        const k1 = req.query.k1 as string
        const sig = req.query.sig as string
        const key = req.query.key as string

        console.log("login::req.query=", req.query)

        const verifiedSig = await ln.verifySig(sig as string, k1 as string, key as string)
        
        console.log(verifiedSig)

        const jwt = await ln.signJWT({ sub: key, idp: "LNURL-auth" })
        
        const user = ln.assignUserKeyJwt(k1 as string, key as string, jwt)

        console.log("login-ln user", user)
        if (user) {
            const resEvent = sessionRes[user.sessionId]
            if (resEvent) {
                console.log("found resEvent")
                sendLoggedInEvents(resEvent)
            }
        }
        
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
    const sessionId = getSessionId(req)

    if (!sessionId)
        return res.json({loggedIn: false, reason: "no session id"})

    console.log("Open event stream")
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
    })

    let counter = 0;
    
    console.log("send connected event")
    res.write(`event: connected\n`)
    res.write(`data: You are now subscribed!\n`)
    res.write(`id: ${counter}\n\n`)
    counter += 1

    const intervalId = setInterval(() => {
        res.write(`data: keep connection alive\n\n`)
    }, 6 * 1000)
    // setInterval(() => {
    //     console.log("send new message")
    //     res.write('event: message\n')
    //     res.write(`data: ${new Date().toLocaleString()}\n`)
    //     res.write(`id: ${counter}\n\n`)
    //     counter += 1
    // }, 5000)
    
    
    sessionRes[sessionId] = res

    req.on("close", () => {
        clearInterval(intervalId)
        console.log("client closed")
        res.end("OK")
        delete sessionRes[sessionId]
    })
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

app.get("/logout", async function (req, res) {

    const cookie = req.headers.cookie

    if (!cookie)
        return res.status(200).json({ loggedIn: false })
    
    return res.status(200).clearCookie("Authorization").json({ loggedIn: false })
})

app.get("*", function (req, res) {
    res.sendFile(webIndex)
})

let port = config.port ? config.port : 5000
const serverUrl = `http://${config.hostname}:${port}`
app.listen(port, '0.0.0.0', () => {
    console.log(`[server]: Server is running at ${serverUrl}`)
})
