import { Request, Response, NextFunction } from "express"
import cookie from "cookie"
import { v4 as uuidv4 } from "uuid"
import { findUserByHash } from "./ln.js"
import { SavedUser } from "@common/types.js"


export function sessionCookie(req: Request, res: Response, next: NextFunction) {
    const existing = getSessionId(req)
    if (!existing)
        createSession(res)
    next()
}

export function getSessionId(req: Request): string | null {
    const cookieHeader = req.headers.cookie
    if (!cookieHeader)
        return null

    const cookies = cookie.parse(cookieHeader)
    if (!cookies.session)
        return null

    return cookies.session as string
}

function createSession(res: Response) {
    const sessionId = uuidv4() as string

    console.log("Assign session", sessionId)
    res.cookie("session", sessionId, {
        httpOnly: true,
        sameSite: "lax",
    })
}

export function sendLoggedInEvents(res: Response) {
    console.log("sendLoggedInEvents")
    res.write("event: authenticated\n")
    res.write("data: You are now authenticated!\n")
    res.write("id: 10")
}

export function sendLoggedInJwt(res: Response, user: SavedUser) {

    if (!user.jwt) {
        console.log("no jwt waiting")
        return res.status(400)
    }

    const jwt = new String(user.jwt)

    user.jwt = undefined

    return res.status(200)
    .set("Cache-Control", "no-store")
    .cookie("Authorization", jwt, {
        maxAge: 24 * 60 * 60 * 1000,
        secure: false,
        httpOnly: true,
        sameSite: "lax",
    })
    // .header('Access-Control-Allow-Origin', serverUrl)
    .header("Access-Control-Allow-Credentials","true")
    .json({ loggedIn: true })
}