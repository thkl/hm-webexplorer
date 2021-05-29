const Manager = require('./Manager.js')
const path = require('path')
const fs = require('fs')
const spawn = require('child_process');

module.exports = class AddonManager extends Manager {

    constructor(coordinator) {
        super()
        let self = this
        this.coordinator = coordinator
        this.installedAddons = {}
        this.addonPath = path.join('/', 'etc', 'config', 'rc.d')
        this.coordinator.addRoute('addons/:addonId?/:action?', (req, res) => {
            self._handleRequest(req, res)
        })
    }

    fetchAddons() {
        const self = this
        const rgxOperations = {
            "name": /Name: ([^\n]*)/,
            "config": /Config-Url: ([^\n]*)/,
            "operations": /Operations: ([^\n]*)/,
            "update": /Update: ([^\n]*)/,
            "version": /Version: ([^\n]*)/
        }

        return new Promise((resolve, reject) => {

            fs.readdir(self.addonPath, (err, files) => {
                if (err) {
                    reject(err)
                }
                self.installedAddons = {}
                files.forEach(file => {
                    let addonRslt = {}
                    const addonFile = path.join(self.addonPath, file)
                    try {
                        let rgxrslt = spawn.execSync(`${addonFile} info`)

                        Object.keys(rgxOperations).forEach(
                            key => {
                                const rgxResult = rgxOperations[key].exec(rgxrslt.toString())
                                if (rgxResult) {
                                    addonRslt[key] = rgxResult[1]
                                }
                            })

                    } catch (e) {
                        console.error(e)
                    }
                    self.installedAddons[file] = addonRslt
                })
                resolve(self.installedAddons)
            })
        })
    }

    restartAddon(addonId) {
        const self = this
        return new Promise(async (resolve, reject) => {
            if (Object.keys(this.installedAddons).length === 0) {
                await self.fetchAddons()
            }
            const selAddon = self.installedAddons[addonId]
            if (selAddon) {
                if (selAddon.operations.indexOf('restart') > -1) {
                    const addonFile = path.join(self.addonPath, addonId)
                    try {
                        spawn.execSync(`${addonFile} restart`)
                        resolve({ result: 'ok' })
                    } catch (e) {
                        resolve({ result: 'error' })
                    }
                } else {
                    reject(new Error('Operation not supported'))
                }
            } else {
                reject(new Error('Addon not found'))
            }
        })
    }

    async handleGetRequests(body, request, response) {
        let action = request.params.action
        let addonId = request.params.addonId
        switch (action) {
            case "restart":
                try {
                    this.restartAddon(addonId).then(result => {
                        response.json(result)
                    })
                } catch (error) {
                    response.json(error);
                }
                break;
            default:
                this.fetchAddons().then(addOnList => {
                    response.json(addOnList)
                })
        }
    }
}

