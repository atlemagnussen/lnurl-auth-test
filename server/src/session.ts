import { Request, Response, NextFunction } from "express"
import cookie from "cookie"
import { IncomingHttpHeaders } from "http"
import { v4 as uuidv4 } from "uuid"


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