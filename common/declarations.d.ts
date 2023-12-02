declare module "lnurl" {
    function encode(url: string): string
    function decode(url: string): string
    function verifyAuthorizationSignature(sig: string, k1: string, key: string)
}
