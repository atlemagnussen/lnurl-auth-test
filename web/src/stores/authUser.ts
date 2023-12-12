import { AuthUserToken } from "@common/types"
import { BehaviorSubject } from "rxjs"
import backendHttp from "./backendHttp"

// const debugUser = {
//     sub: "035492d1d50dd7c24ea8b39a67c2a56383493fc1c36d593e5d67308943fe3ebd34",
//     idp: "LNURL-auth",
//     iat: 1702167615,
//     iss: "www.atle.guru",
//     aud: "users",
//     exp: 1702254015
// }

const authUserSubject = new BehaviorSubject<AuthUserToken | null>(null)

export const authUser = authUserSubject.asObservable()

export async function getAuthUser() {
    try {
        const user  = await backendHttp.get<AuthUserToken>("logged-in-user")
        authUserSubject.next(user)
        return user
    }
    catch (error) {
        const currentUser = authUserSubject.getValue()
        if (currentUser?.sub)
            authUserSubject.next(null)
    }
    return null
}

export function getJwt() {
    return backendHttp.get("get-access-token")
}

export function getUserNow() {
    return authUserSubject.getValue()
}

export async function logOut() {
    await backendHttp.get("logout")
    getAuthUser()
}