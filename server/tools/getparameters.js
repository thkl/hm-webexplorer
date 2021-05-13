const fs = require('fs')
let regex = /set param ([A-Z_\-0-9]{1,})\n/gi
let regex2 = /\[([A-Za-z]{1,})\s\$/g
let args = process.argv
let file = args[2]
let txt = String(fs.readFileSync(file))
let match = regex.exec(txt)
let tags = []
while (match != null) {
    tags.push(match[1])
    match = regex.exec(txt)
}

let i = 0
while (i < tags.length) {
    let first = tags[i]
    let next = tags[i + 1]
    let f1 = txt.indexOf(first) + first.length
    let f2 = txt.length
    if (next) {
        let f2 = txt.indexOf(next)
    }
    let html = txt.substr(f1, f2 - f1)

    let im = regex2.exec(html)
    if (im) {
        console.log(first, '->', im[1])
    } else {
        console.log(first, ' !')
    }


    i = i + 1
}
