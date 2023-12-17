let randomStringFromServer = "fdkjhsdf65dsfuihsdf"

export async function getCredentials() {
    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge: Uint8Array.from(
            randomStringFromServer, c => c.charCodeAt(0)),
        rp: {
            name: "AtleGuru",
            id: "www.atle.guru",
        },
        user: {
            id: Uint8Array.from(
                "UZSL85T9AFC", c => c.charCodeAt(0)),
            name: "atle@atle.guru",
            displayName: "AtleGuru",
        },
        pubKeyCredParams: [{alg: -7, type: "public-key"}],
        authenticatorSelection: {
            authenticatorAttachment: "cross-platform",
        },
        timeout: 60000,
        attestation: "direct"
    }
    const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
    })
    return credential
}


