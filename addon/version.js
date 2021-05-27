const path = require('path');
const fs = require('fs');
const appVersion = require(path.join(__dirname, '..', 'client', 'package.json')).version;
const versionFile = path.join(__dirname, 'VERSION');
fs.writeFileSync(versionFile, appVersion);
