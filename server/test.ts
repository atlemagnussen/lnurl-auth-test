import * as ln from "./src/ln"


async function test() {
    //const jwt = await ln.signJWT()
    const k1 = await ln.generateK1()
    console.log(k1)
}

test().catch(err => {
    console.error(err)
})