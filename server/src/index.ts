import path from "path"
import express from "express"
import bodyParser from "body-parser"
import config from "./config"


const app = express()
app.use(bodyParser.json()) 

const rootFolder = __dirname
console.log("rootFolder", rootFolder)
const web = path.resolve("..", "web/dist")
console.log("web", web)
const webIndex = path.resolve(web, "index.html")

app.use(express.static(web))

app.get('*', function (req, res) {
    res.sendFile(webIndex)
})

let port = config.port ? config.port : 5000
app.listen(port, '0.0.0.0', () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
})
