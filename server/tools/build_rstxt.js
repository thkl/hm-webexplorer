let rg1 = /elvST\[\'([A-Za-z0-9|_=]{1,})\'\] = \'\$\{([A-Za-z0-9]{1,})\}/gm

const fs = require('fs')
const occuPath = '/Users/thomaskluge/Downloads/occu-master/';
const webjs = occuPath + 'WebUI/www/webui/webui.js';
const content = fs.readFileSync(webjs).toString();

const output = __dirname + '/../lib/parameters/elvst.json'
let data = {}
const matches = content.matchAll(rg1);
for (const match of matches) {
    data[match[1]] = match[2]
}
fs.writeFileSync(output, JSON.stringify(data, ' ', 2))