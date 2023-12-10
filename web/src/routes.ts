import "@appnest/web-router"
import "./views"
import { RouterSlot } from "@appnest/web-router"

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
            path: "home",
            component: defaultView()
        },
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
            component: document.createElement("user-profile-view")
        },
        {
            path: "login",
            component: document.createElement("login-dialog")
        },
        {
            path: "**",
            redirectTo: "home"
        }
    ])
}
