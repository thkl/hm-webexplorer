const Manager = require('./Manager.js')
const path = require('path')
const fs = require('fs')
const spawn = require('child_process');
const { response } = require('express');

module.exports = class AddonManager extends Manager {

    constructor(coordinator) {
        super()
        let self = this
        this.coordinator = coordinator

        this.coordinator.addRoute('addons/:action?/:option?', (req, res) => {
            self._handleRequest(req, res)
        })
    }

    fetchAddons() {

        const rgxOperations = {
            "name": /Name: ([^\n]*)/,
            "config": /Config-Url: ([^\n]*)/,
            "operations": /Operations: ([^\n]*)/,
            "update": /Update: ([^\n]*)/,
            "version": /Version: ([^\n]*)/
        }

        return new Promise((resolve, reject) => {
            const addonPath = path.join('/', 'etc', 'config', 'rc.d')
            fs.readdir(addonPath, (err, files) => {
                if (err) {
                    reject(err)
                }
                let rslt = {}
                files.forEach(file => {
                    let addonRslt = {}
                    const addonFile = path.join(addonPath, file)
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
                    rslt[file] = addonRslt
                })
                resolve(rslt)
            })
        })
    }

    async handleGetRequests(body, request, response) {
        let action = request.params.action
        let option = request.params.option
        switch (action) {
            default:
                this.fetchAddons().then(addOnList => {
                    response.json(addOnList)
                })
        }
    }
}

