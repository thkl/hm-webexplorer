/*
 * **************************************************************
 * File: ParameterSetManager.js
 * Project: hm-webexplorer-server
 * File Created: Monday, 15th March 2021 3:13:38 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:33:39 am
 * Modified By: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Copyright 2020 - 2021 @thkl / github.com/thkl
 * -----
 * **************************************************************
 * MIT License
 * 
 * Copyright (c) 2021 github.com/thkl
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * **************************************************************
 */


const Manager = require('./Manager.js')
const fs = require('fs')
const path = require('path')

module.exports = class ParameterSetManager extends Manager {

    constructor(coordinator) {
        super()
        let self = this
        this.coordinator = coordinator

        this.coordinator.addRoute('paramset/:device/:channel?/:set?', (req, res) => {
            self._handleRequest(req, res)
        })

    }

    buildControlSection(oDevice, pset, psetId) {
        // load control descriptions
        let controls = {}
        let oInterface = this.coordinator.regaManager.interfaceByid(parseInt(oDevice.interface))
        let mappingFile = path.join(__dirname, 'parameters', oInterface.name, psetId + '.json')
        if (!fs.existsSync(mappingFile)) {
            console.log('%s not found try common', mappingFile)
            mappingFile = path.join(__dirname, 'parameters', oInterface.name, 'common.json')
        }
        if (fs.existsSync(mappingFile)) {
            let mapping = JSON.parse(fs.readFileSync(mappingFile))
            Object.keys(pset).forEach(key => {
                if (mapping[key]) {
                    controls[key] = mapping[key]
                }
            })
        } else {
            console.log('%s not found', mappingFile)
        }
        return controls
    }

    async handleGetRequests(body, request, response) {
        let device = request.params.device
        let channel = request.params.channel
        let paramset = request.params.set || 'MASTER'
        if (device) {
            // fetch the device
            let oDevice = this.coordinator.regaManager.deviceByAddress(device)
            // get the interface
            if (oDevice) {
                let adr = oDevice.serial
                if (channel) {
                    adr = adr + ':' + channel
                }
                let psetId = await this.coordinator.rpcManager.rpcCall(oDevice.interface, 'getParamsetId', [adr, paramset])
                let pset = await this.coordinator.rpcManager.rpcCall(oDevice.interface, 'getParamsetDescription', [adr, paramset])
                let psetValues = await this.coordinator.rpcManager.rpcCall(oDevice.interface, 'getParamset', [adr, paramset])
                Object.keys(pset).forEach(psetKey => {
                    pset[psetKey].VALUE = psetValues[psetKey]
                })
                let controls = this.buildControlSection(oDevice, pset, psetId)
                response.json({ paramsetid: psetId, paramset: pset, controls: controls })
            } else {
                response.json({ error: 'device not found.consider a api /device call first' })
            }
        } else {
            response.json({ error: 'missing address' })
        }

    }

    async handlePutRequests(body, request, response) {
        let device = request.params.device
        let channel = request.params.channel
        let set = request.params.set
        let oDevice = this.coordinator.regaManager.deviceByAddress(device)
        if (oDevice) {
            let adr = oDevice.serial
            if (channel) {
                adr = adr + ':' + channel
            }
            let paramset = body
            if (typeof paramset === 'string') {
                paramset = JSON.parse(paramset)
            }
            this.coordinator.rpcManager.rpcCall(oDevice.interface, 'putParamset', [adr, set, paramset]).then(result => {
                response.json({ message: result })
            }).catch((error) => {
                response.json({ error: error })
            })

        } else {
            response.json({ error: 'missing address' })
        }
    }


}