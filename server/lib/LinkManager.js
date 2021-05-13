/*
 * **************************************************************
 * File: LinkManager.js
 * Project: hm-webexplorer-server
 * File Created: Monday, 15th March 2021 6:34:31 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:33:24 am
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
const CCUDirectLink = require('./CCUDirectLink.js')

module.exports = class LinkManager extends Manager {

    constructor(coordinator) {
        super()
        let self = this
        this.coordinator = coordinator

        this.coordinator.addRoute('links/:interface?/:action?', (req, res) => {
            self._handleRequest(req, res)
        })

    }

    getLinks(dInterface) {
        let self = this
        return new Promise(async (resolve) => {
            if (dInterface) {
                let links = await self.coordinator.rpcManager.rpcCall(dInterface, 'getLinks', ['', 7])
                resolve(links)
            } else {
                console.log('get all links')
                // loop thru all interfaces
                let result = {}
                let operations = []
                // Build a operation stack for all known interfaces
                Object.keys(self.coordinator.rpcManager.interfaces).forEach(ifId => {
                    // add the getLinks operation
                    console.log(ifId)
                    operations.push(new Promise(async resolve => {
                        let links = await self.coordinator.rpcManager.rpcCall(ifId, 'getLinks', ['', 7])
                        let linkList = []
                        links.forEach(link => {
                            let oLink = new CCUDirectLink(link.NAME, link.DESCRIPTION, link.FLAGS)
                            oLink.setSender(link.SENDER, link.SENDER_PARAMSET)
                            oLink.setReceiver(link.RECEIVER, link.RECEIVER_PARAMSET)
                            oLink.getEasyModeSets(self.coordinator)
                            linkList.push(oLink)

                        })
                        result[ifId] = linkList
                        resolve()
                    }))
                })
                // run the stack
                Promise.all(operations).then(() => {
                    console.log('return')
                    resolve(result)
                })
            }
        })
    }

    getLinkableChannelsFromInterface(dInterface) {
        let self = this
        return new Promise(async (resolve) => {
            let devices = await self.coordinator.rpcManager.rpcCall(dInterface, 'listDevices', [])
            let result = []
            devices.forEach(device => {
                if ((device.LINK_SOURCE_ROLES) || (device.LINK_TARGET_ROLES)) {
                    result.push(device)
                }
            })
            resolve(result)
        })
    }

    async handleGetRequests(body, request, response) {
        let dInterface = request.params.interface
        let action = request.params.action

        switch (action) {
            case 'new':
                let list = await this.getLinkableChannelsFromInterface(dInterface)
                response.json(list)
                break;

            default:
                let result = await this.getLinks(dInterface)
                response.json(result)
        }

    }

    async handlePutRequests(body, request, response) {
        let address = request.params.address
        if (address) {

        } else {
            response.json({ error: 'missing address' })
        }
    }


}