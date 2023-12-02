export interface ConfigFolder {
    title: string
}

export type Action = "register" | "login" | "link" | "auth"

export interface LoginUrlResponse {
    url: string
    encodedUrl: string
    k1: string
    k1Hash: string
    sessionToken: string
}