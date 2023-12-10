import { BackendError, ErrorResponse } from "@common/types"

const baseUrl = location.origin

const jsonContentType = "application/json"

const get = async <T>(url: string) => {
    const req = createRequest(url, "get", jsonContentType)
    return await http<T>(req)
}
const post = <T>(url: string, data?: any) => {
    const req = createRequest(url, "post", jsonContentType, data)
    return http<T>(req)
}
const put = <T>(url: string, data?: any) => {
    const req = createRequest(url, "put", jsonContentType, data)
    return http<T>(req)
}

const createRequest = (url: string, method: string, contentType?: string, data?: any) => {
    
    const args: RequestInit = {
        method,
        headers: {"Content-Type": contentType} as HeadersInit
    }
    
    if (data) {
        if (contentType === jsonContentType)
            args.body = JSON.stringify(data)
        else
            args.body = data
    }
    
    let fullUrl = `${baseUrl}/${url}`
    if (!url || url === "/")
        fullUrl = `${baseUrl}`
    else if (url.startsWith("/"))
        fullUrl = `${baseUrl}${url}`
    return new Request(fullUrl, args)
}

async function http<T>(request: RequestInfo): Promise<T> {
    const res = await fetch(request)
    return resHandler(res)
}

const resHandler = async (res: Response) => {
    let errorFetchMsg: string
    if (res.ok) {
        const contentType = res.headers.get("content-type")
        if (res.status === 200 || res.status === 201) {
            
            if (contentType && contentType.includes("application/json")) {
                const json = await res.json()
                return json
            }
            const text = await res.text()
            return text
        }
        else {
            return ""
        }
    } else {
        console.debug(`${res.statusText} (${res.status})`)
        
        errorFetchMsg = "Error fetching"
        
        if (res.status >= 400 && res.status <= 500) {
            try {
                const pd = await res.json() as ErrorResponse
                if (pd.reason)
                    throw new BackendError(errorFetchMsg, res.status, pd.reason)
            }
            catch (ex) {
                console.debug(ex);
            }
            throw new BackendError(errorFetchMsg, res.status)
        } else {
            const message = await res.text()
            if (message)
                errorFetchMsg = message
        }
        
        throw new BackendError(errorFetchMsg, res.status)
    }
}

export default { get, post, put }