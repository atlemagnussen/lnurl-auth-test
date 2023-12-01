import backendHttp from "@app/stores/backendHttp"

export function getLnLoginUrl() {
    const url = "login-url"
    return backendHttp.get(url)
}