export interface ConfigFolder {
    title: string
}

export type Action = "register" | "login" | "link" | "auth"

export interface LoginUrlResponse {
    url: string
    encodedUrl: string
    urlLnScheme: string
    k1: string
    hash: string
    sessionToken: string
}

export interface SavedUser {
    k1: string
    hash: string
    key?: string
    jwt?: string
}

export type ErrorResponse = {
    reason: string
}

export class BackendError extends Error {

    status = 0
    reason: string | undefined
    
    constructor(message: string, status: number, reason?: string) {
        super(message)
        this.status = status
        this.reason = reason
    }
}

export interface AuthUserToken {
    sub: string
    iss: string
    aud: string
    idp?: string
    iat: number
    exp: number
}