/*
 * **************************************************************
 * File: DeviceManager.js
 * Project: hm-webexplorer-server
 * File Created: Friday, 12th March 2021 5:08:14 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:32:58 am
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
const HMInterface = require('hm-interface')

const CCUDirectLink = require('./CCUDirectLink.js')

module.exports = class DeviceManager extends Manager {

    constructor(coordinator) {
        super()
        let self = this
        this.coordinator = coordinator

        this.coordinator.addRoute('device/:deviceid?/:action?/:reference1?/:reference2?', (req, res) => {
            self._handleRequest(req, res)
        })

    }


    deleteDevice(oDevice) {
        let self = this
        return new Promise(async (resolve, reject) => {
            // first remove all direct links (getLinkPeers) - we have to loop thru all visible channelz
            oDevice.channels.forEach(async (channel) => {
                let adr = oDevice.serial + ':' + String(channel.channelIndex)
                try {
                    links = await self.coordinator.rpcManager.rpcCall(oDevice.interface, 'getLinkPeers', [adr])
                    // loop thru all links and remove them from the interface
                    links.forEach(async (link) => {
                        try {
                            await self.coordinator.rpcManager.rpcCall(oDevice.interface, 'removeLink', [adr, link])
                        } catch (e) { }
                    })
                } catch (e) { }
            })

            oDevice.channels.forEach(async (channel) => {
                // remove all ValueUsage (reportValueUsage)
                let adr = oDevice.serial + ':' + String(channel.channelIndex)
                channel.datapoints.forEach(datapoint => {
                    let hmAddress = new HMInterface.HomeMaticAddress(datapoint)
                    self.coordinator.rpcManager.rpcCall(oDevice.interface, 'reportValueUsage', [adr, hmAddress.dpName])
                })
            })

            // remove the device from the Interface (deleteDevice) // Flag is Remove even the device is not available
            let oInterface = this.coordinator.regaManager.interfaceByid(oDevice.interface)
            let flags = [oDevice.serial]
            if (oInterface) {
                flags.push(this.coordinator.rpcManager.interfaceFlagsForOperation(oInterface.name, 'deleteDevice'))
            }
            self.coordinator.rpcManager.rpcCall(oDevice.interface, 'deleteDevice', flags).then(async (result) => {
                await self.coordinator.regaManager.fetchDevices()
                resolve()
            }).catch(error => {
                response.json({ messaage: error })
                reject(error)
            })
        })
    }


    async getLinksForDevice(oDevice) {
        let self = this
        return new Promise(async (response, reject) => {
            let adr = oDevice.serial
            let result = []
            let links = await this.coordinator.rpcManager.rpcCall(oDevice.interface, 'getLinks', [adr, 7])
            links.forEach(link => {
                let oLink = new CCUDirectLink(link.NAME, link.DESCRIPTION, link.FLAGS)
                oLink.setSender(link.SENDER, link.SENDER_PARAMSET)
                oLink.setReceiver(link.RECEIVER, link.RECEIVER_PARAMSET)
                oLink.getEasyModeSets(self.coordinator)
                result.push(oLink)

            })
            response(result)
        })
    }

    async handleGetRequests(body, request, response) {
        let deviceID = request.params.deviceid
        let action = request.params.action

        if (deviceID) {
            let device = this.coordinator.regaManager.deviceByidOrSerial(deviceID)
            if (device === undefined) { // Its not cached so get it 
                await this.coordinator.regaManager.fetchDevices(true)
                device = this.coordinator.regaManager.deviceByidOrSerial(deviceID)
                device = await this.coordinator.regaManager.updateDeviceWithId(device.id) // fetch it with all details again 
            } else {
                device = await this.coordinator.regaManager.updateDeviceWithId(device.id)
            }

            if (!device) {
                response.json({ error: 'device not found' })
            } else {

                switch (action) {
                    case 'links':
                        let links = await this.getLinksForDevice(device)
                        response.json(links)
                        break;

                    case 'progs':
                        let prg = await this.coordinator.regaManager.getLinksOrPrograms(device.id);
                        response.json(prg)
                        break

                    default:
                        response.json({ device: device })
                        break;
                }

            }

        } else {
            let deviceList = await this.coordinator.regaManager.fetchDevices()
            response.json({ devices: deviceList })
        }
    }

    async handlePostRequests(body, request, response) {
        let deviceID = request.params.deviceid
        if (deviceID) {
            if (deviceID === 'new') {
                let ifId = request.params.action
                if (ifId) {
                    let oInterface = this.coordinator.regaManager.interfaceByid(ifId)
                    let flags
                    // switch off install mode
                    if (body.stop) {
                        flags = [false]
                        this.coordinator.sendMessageToSockets({ system: 'updatedevices' }) // tell others to update
                    } else {
                        flags = [true, 60]
                        if (oInterface) {
                            flags.push(this.coordinator.rpcManager.interfaceFlagsForOperation(oInterface.name, 'setInstallMode'))
                        }
                    }

                    this.coordinator.rpcManager.rpcCall(ifId, 'setInstallMode', flags).then((result) => {
                        response.json({ message: 'installmode is running', result: result })
                    })
                } else {
                    response.json({ message: 'no interface provided' })
                }
            }
        } else {
            response.json({ message: 'deviceid should be new' })
        }
    }

    async handlePatchRequests(body, request, response) {
        let self = this
        let deviceID = request.params.deviceid
        let readyFlag = request.params.action
        let roomChangeDetected = false
        let fckChangeDetected = false
        if (deviceID) {
            let device = this.coordinator.regaManager.deviceByidOrSerial(deviceID)
            if (device) {
                let result = {}
                // check all editable properties
                if ((body.name) && (device.name !== body.name)) {
                    device.name = body.name
                    result.device = await this.coordinator.regaManager.saveObject(device)
                    self.coordinator.sendMessageToSockets({ device })
                }
                let channelOperations = []
                let roomChange = false
                let fckChange = false
                if (body.channels) {
                    body.channels.forEach(async channel => {
                        channelOperations.push(new Promise(async (resolve) => {
                            let oChannel = self.coordinator.regaManager.channelById(channel.id)
                            if (oChannel) {
                                if (oChannel.name !== channel.name) {
                                    oChannel.name = channel.name
                                    result['channel' + channel.id] = await self.coordinator.regaManager.saveObject(oChannel)
                                }
                                // patch the rooms 
                                if (channel.rooms) {
                                    let roomChange = oChannel.setRooms(channel.rooms)
                                    if (roomChange !== '') {
                                        roomChangeDetected = true
                                        await self.coordinator.regaManager.script(roomChange)
                                        // update local data
                                        oChannel.setRooms(channel.rooms, false)
                                        // message all clients to update there room lists
                                        roomChange = true

                                    }
                                }
                                // patch the functions
                                if (channel.functions) {
                                    let funcChange = oChannel.setFunctions(channel.functions)
                                    if (funcChange !== '') {
                                        fckChangeDetected = true
                                        await self.coordinator.regaManager.script(funcChange)
                                        // update local data
                                        oChannel.setFunctions(channel.functions, false)
                                        // message all clients to update there room lists
                                        fckChange = true
                                    }
                                }
                                // send it to all clients
                                self.coordinator.sendMessageToSockets({ channel: oChannel })
                            }
                            resolve()
                        }))
                    });
                }
                await Promise.all(channelOperations)
                if (readyFlag === 'setReady') {
                    result.readyFlag = await this.coordinator.regaManager.setDeviceReadyConfig(device)
                }
                self.coordinator.sendMessageToSockets({ device })
                if (roomChangeDetected === true) {
                    console.log('Room Change detected')
                    self.coordinator.sendMessageToSockets({ system: 'updaterooms' })
                }
                if (fckChangeDetected === true) {
                    console.log('function Change detected')
                    self.coordinator.sendMessageToSockets({ system: 'updatefunctions' })
                }
                response.json({ msg: result })
                return
            } else {
                console.log('device with id %s not found', deviceID)
            }
        }
        response.json({ error: 'device not found.consider a query first' })
    }

    async handleDeleteRequests(body, request, response) {
        let self = this
        let deviceID = request.params.deviceid
        let action = request.params.action
        let reference1 = request.params.reference1
        let reference2 = request.params.reference2

        // Check the device in Rega
        let oDevice = this.coordinator.regaManager.deviceByidOrSerial(deviceID)
        if (oDevice) {
            switch (action) {
                case 'removelink':
                    let result = await self.coordinator.rpcManager.rpcCall(oDevice.interface, 'removeLink', [reference1, reference2])
                    response.json({ message: 'link removed', result: result })
                    break;

                default:
                    let links = await this.deleteDevice(oDevice)
                    response.json({ message: 'removed', device: oDevice.serial, links: links })
                    self.coordinator.sendMessageToSockets({ system: 'updatedevices' })
                    break;
            }
        } else {
            response.json({ error: 'device with id ' + deviceID + ' not found consider a /device get first' })
        }
    }
}