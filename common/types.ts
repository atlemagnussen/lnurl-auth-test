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

export interface ErrorResponse {
    reason: string
}