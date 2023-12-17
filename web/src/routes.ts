import "router-slot"
import { RouterSlot } from "router-slot"
import "./views"
import { getUserNow } from "./stores/authUser"

type RoutePaths = "/" | "/profile" | "/login"

export function navigateTo(path: RoutePaths) {
    history.replaceState(null, "", path)
}

const defaultView = () => {
    return document.createElement("home-view")
}

// customElements.whenDefined("router-slot").then(() => {
export function setupRoutes(routerSlot:  RouterSlot<any, any> | null | undefined) {
    
    // const routerSlot = document.querySelector("router-slot")
    if (!routerSlot)
        throw new Error("NO ROUTER ELEMENT!")

    routerSlot.add([
        {
            path: "thread/:forum/:threadId",
            component: document.createElement("thread-view"),
            /// @ts-ignore
            setup: (component: ThreadView, info: RoutingInfo) => {
                component.forum = info.match.params.forum;
                component.thread = info.match.params.threadId;
            }
        },
        {
            path: "profile",
            component: document.createElement("user-profile-view"),
            guards: [loggedInGuard]
        },
        {
            path: "login",
            component: document.createElement("login-view")
        },
        {
            path: "/",
            component: defaultView()
        },
        {
            path: "**",
            redirectTo: "/"
        }
    ])
}

function loggedInGuard () {
    const user = getUserNow()

    if (!user || !user.sub) {
        history.replaceState(null, "", "/login")
        return false
    }
  
    return true
}