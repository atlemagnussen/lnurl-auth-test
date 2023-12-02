import path from "path"
import express from "express"
import bodyParser from "body-parser"
import config from "@lib/config.js"
import * as ln from "@lib/ln.js"

const app = express()
app.use(bodyParser.json()) 

const rootFolder = __dirname
console.log("rootFolder", rootFolder)
const web = path.resolve("..", "web/dist")
console.log("web", web)
const webIndex = path.resolve(web, "index.html")

app.use(express.static(web))

app.get("/login-url", async (req, res) => {
    const action = req.query.action ?? "login"
    console.log("action", action)
    
    try {
        const loginUrlData = await ln.getLoginUrl(action as ln.Action)
        return res.status(200).json(loginUrlData)

    } catch (error) {
        res.status(500).send("Unexpected error happened, please try again");
    }
})

app.get('/login', async (req,res) => {
    try {
        const { tag, k1, sig, key } = req.query;

        console.log("req.query=", req.query)

        const verifiedSig = ln.verifySig(sig as string, k1 as string, key as string)
        
        console.log(verifiedSig)


        // generate the auth jwt token
        const hour = 3600000
        const maxAge = 30 * 24 * hour;

        const jwt = await ln.signJWT({ pubKey: key })
        console.log("jwt", jwt)
        return res.status(200).json({ status: "OK" })

    } catch(error) {
        return res.status(400).json({ status: 'ERROR', reason: 'Something wrong happened...' })
    }
})

app.get('*', function (req, res) {
    res.sendFile(webIndex)
})

let port = config.port ? config.port : 5000
app.listen(port, '0.0.0.0', () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
})
