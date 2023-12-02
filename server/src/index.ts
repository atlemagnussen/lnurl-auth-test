import path from "path"
import express from "express"
import bodyParser from "body-parser"
import config from "./config.js"
import * as ln from "./ln.js"
import type { Action } from "../../common/types.js"

const app = express()
app.use(bodyParser.json()) 

const rootFolder = process.cwd()
console.log("rootFolder", rootFolder)
const web = path.resolve("..", "web/dist")
console.log("web", web)
const webIndex = path.resolve(web, "index.html")

app.use(express.static(web))

app.get("/login-url", async (req, res) => {
    const action = req.query.action ?? "login"
    console.log("action", action)
    
    try {
        const loginUrlData = await ln.getLoginUrl(action as Action)
        console.log(loginUrlData.sessionToken)
        return res.status(200).json(loginUrlData)

    } catch (error) {
        res.status(500).send("Unexpected error happened, please try again");
    }
})

app.get("/login", async (req, res) => {
    try {
        const { tag, k1, sig, key } = req.query;

        console.log("req.query=", req.query)

        const verifiedSig = await ln.verifySig(sig as string, k1 as string, key as string)
        
        console.log(verifiedSig)


        // generate the auth jwt token
        const hour = 3600000
        const maxAge = 30 * 24 * hour;

        const jwt = await ln.signJWT({ sub: key })
        
        ln.assignUserKeyJwt(k1 as string, key as string, jwt)

        return res.status(200).json({ status: "OK" })

    } catch(error: any) {
        console.log("error")
        console.error(error.message)
        return res.status(400).json({ status: 'ERROR', reason: error.message })
    }
})

app.get("/is-logged-in", async (req, res) => {
    const sessionToken = req.headers.session_token as string

    if (!sessionToken)
        return res.json({loggedIn: false})

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
                    maxAge: 60 * 60 * 1000,
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
    catch (error) {
        console.error(error)
    }
    return res.json({loggedIn: false, msg: "Could not find user"})
})

app.get("/protected", async function (req, res) {

    const cookie = req.headers.cookie
    try {
        const userToken = await ln.extractUserFromCookie(cookie)
        console.log(userToken)
        const { sub } = userToken
        return res.json({sub})
    }
    catch (error: any) {
        console.log(error)
        return res.status(400)
        .json({ status: 'ERROR', reason: error.message })
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
