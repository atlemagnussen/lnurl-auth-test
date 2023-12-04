import dotenv from "dotenv"
import path from "path"

const environment = process.env.NODE_ENV ?? ""
console.log("env", environment)

const envFile = environment ? `.env.${environment}` : ".env"
const envFilePath = path.join(process.cwd(), "..", envFile)
console.log(`environment: ${environment}, envFilePath: ${envFilePath}`)

const config = dotenv.config({ path: envFilePath})
console.log(config)

const portStr = process.env.PORT as string
const port = portStr ? parseInt(portStr) : 8000

const title = process.env.TITLE ? process.env.TITLE : "Dir list++"

const hostname = process.env.HOSTNAME ? process.env.HOSTNAME : "localhost"

const portInLnLink = (process.env.PORTINLNLINK && process.env.PORTINLNLINK == "true") ? true : false

export default {
    title,
    port,
    portInLnLink,
    hostname
}

