const fs = require('fs')

let destFile = __dirname + '/../easymodes/options.json'

let rgx = /[\s]{1,}\"([A-Za-z_0-9]{1,})[\"\s\{\n\s]{1,}/g
let rgxoLs = /\s\{/  // Option Line Start
let rgxEoL = /\s\}/ // OPtion Line Ends

let rgxDetail = /set options\(([0-9.]{1,})\)\s{1,}\"([0-9a-zA-Z\\]{1,})\$([a-zA-Z\{\}]{1,})\"/gi

let args = process.argv

if (args.length < 3) {
    console.log('missing arguments')
    process.exit(-1)
}


let occuPath = '/Users/thomaskluge/Downloads/occu-master/WebUI/www/config/easymodes/'

let optionsFile = occuPath + args[2]
let optionsCat = args[3]

if (fs.existsSync(optionsFile) === false) {
    console.log('options %s source not found', optionsFile)
    process.exit(-2)
}

console.log('processing %s for category %s', optionsFile, optionsCat)

let tx = String(fs.readFileSync(optionsFile))

let items = {}

const matches = tx.matchAll(rgx);
for (const match of matches) {
    let key = match[1]
    let cutted = tx.substr(match.index)
    let start = rgxoLs.exec(cutted)
    let end = rgxEoL.exec(cutted)
    let options = cutted.substr(start.index + 1, end.index - start.index)

    let oMatch = rgxDetail.exec(options)
    items[key] = {}
    while (oMatch !== null) {
        let oVal = oMatch[1]
        let osVal = oMatch[2]
        let oUnit = oMatch[3]
        if (osVal === '\\') {
            osVal = ''
        }
        items[key][oVal] = {}
        items[key][oVal].value = osVal
        let vl = oUnit.replace('{', '').replace('}', '')
        items[key][oVal].unit = vl

        oMatch = rgxDetail.exec(options)
    }
}

console.log('new Options found: ' + Object.keys(items).length)


let cmplItems = {}
try {
    cmplItems = JSON.parse(fs.readFileSync(destFile))
} catch (e) {

}

cmplItems[optionsCat] = items

fs.writeFileSync(destFile, JSON.stringify(cmplItems, 4, '\t'))
console.log("%s written", destFile)

console.log(cmplItems)