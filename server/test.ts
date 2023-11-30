import * as ln from "./src/ln"


async function test() {
    const jwt = await ln.signJWT()
    console.log(jwt)
}

test().catch(err => {
    console.error(err)
})