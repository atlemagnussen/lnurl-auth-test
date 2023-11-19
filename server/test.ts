import mime from "mime-types"

const extensions = ["mp3", "aac", "m4a", "m4b", "ogg", "opus", "flac", "wav", "webm", "mp4", "m4v", "mov", "avi", "mkv", "wmv", "mpg", "mpeg", "m4v", "m4p", "m4r", "m4v", "3gp", "3g2", "flv", "f4v", "f4p", "f4a", "f4b"]

extensions.forEach(ext => {
    const mt = mime.lookup(ext)
    if (mt)
        console.log(`${ext} = ${mt}`)
    else
        console.log(`${ext} MISSING`)
})