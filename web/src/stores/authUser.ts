import { AuthUserToken } from "@common/types"
import { BehaviorSubject } from "rxjs"
import backendHttp from "./backendHttp"

const authUserSubject = new BehaviorSubject<AuthUserToken | null>(null)

export const authUser = authUserSubject.asObservable()

export async function getAuthUser() {
    try {
        const user  = await backendHttp.get<AuthUserToken>("logged-in-user")
        authUserSubject.next(user)
    }
    catch (error) {
        const currentUser = authUserSubject.getValue()
        if (currentUser?.iss)
            authUserSubject.next(null)
    }
}