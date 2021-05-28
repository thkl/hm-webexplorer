/*
 * **************************************************************
 * File: Coordinator.js
 * Project: hm-webexplorer-server
 * File Created: Thursday, 11th March 2021 7:32:42 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:32:34 am
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

const HMInterface = require('hm-interface')
const Manager = require('./Manager')
const path = require('path')
const fs = require('fs')
const Url = require('url')
const TaskManager = require('./TaskManager.js')

module.exports = class Coordinator extends Manager {

    constructor(ccu, app, server, rpcPort) {

        super()
        let self = this
        this.log = HMInterface.logger.logger('Server')
        this.log.info('CCU Host is %s', ccu.host)
        this.interfaceEventManager = new HMInterface.HomematicClientInterfaceManager({ clientName: 'hmx', timeout: 600, port: rpcPort })

        this._regaManager = new HMInterface.HomeMaticRegaManager({
            ccuIP: ccu.host,
            username: ccu.username,
            password: ccu.password
        })

        this._rpcManager = new HMInterface.HomeMaticRPCManager()
        this._configPath = undefined
        this._ccuhost = ccu.host
        this._app = app
        this._apiVersion = '1'
        this._apiPrefix = '/api'
        this.connections = {}

        this.initRPCInterfaceManager()
        this.addRoute('config/:item?/:parameter?', (req, res) => {
            self._handleRequest(req, res)
        })

        this.socketio = require("socket.io")(server, {
            cors: true,
            path: "/websockets/"
        })

        this.socketio.on("connection", (socket) => {
            self.connections[socket.id] = socket

            socket.on("disconnect", (reason) => {
                delete self.connections[socket.id]
            });

            socket.onAny((event, ...args) => {


            });
        });

        this.taskManager = new TaskManager(this)
        this.taskManager.startTasks();
    }

    set configPath(newPath) {
        this._configPath = newPath
    }

    get configPath() {
        return this._configPath
    }

    setDebug() {
        HMInterface.logger.setDebugEnabled(true)
    }

    getLog() {
        if (this.log === undefined) {
            console.log('Generate new Logger')
            this.log = HMInterface.logger.logger('Server')
        }
        return this.log
    }

    hazClients() {
        return (Object.keys(this.connections).length > 0)
    }

    sendMessageToSockets(message) {
        let self = this
        Object.keys(this.connections).map((connId) => {
            let conn = self.connections[connId]
            try {
                if (conn) {
                    conn.write(JSON.stringify(message))
                }
            } catch (error) {
                if (conn) {
                    try {
                        conn.close()
                    } catch (error) { }
                }
            }
        })
    }

    get ccuHost() {
        return this._ccuhost
    }

    get app() {
        return this._app
    }

    get regaManager() {
        return this._regaManager
    }

    get rpcManager() {
        return this._rpcManager
    }

    addRoute(method, callback) {
        this._app.use(`${this._apiPrefix}/${this._apiVersion}/${method}`, (req, res) => {
            callback(req, res)
        })
    }


    async handleGetRequests(body, request, response) {
        let item = request.params.item
        let parameter = request.params.parameter
        let file


        switch (item) {
            case 'localization':
                file = path.join(__dirname, '..', 'easymodes', 'localization', parameter, 'loc.json')
                let loc = require(file)
                file = path.join(__dirname, '..', 'locale', parameter + '.json')
                loc.REGA = require(file)
                response.json(loc)
                break;
            case 'options':
                file = path.join(__dirname, '..', 'easymodes', 'options.json')
                response.json(require(file))
                break;
            case 'ruleTexts':
                file = path.join(__dirname, 'parameters', 'elvst.json')
                response.json(require(file))
                break;
            default:
                response.json({
                    config: {
                        ccu: this.ccuHost
                    }
                })
                break;
        }
    }



    initRPCInterfaceManager() {
        let self = this
        this.log.info('Init initRPCInterfaceManager')
        // get the interfaces to add onto the rpcManager
        this.portRpl = { 'BidCos-RF': 2001, 'VirtualDevices': 9292, 'HmIP-RF': 2010 }

        this.regaManager.fetchInterfaces().then(list => {
            if (list) {
                list.forEach(oInterface => {
                    if (oInterface.url) {
                        self._rpcManager.addInterface(oInterface.id, self._ccuhost, oInterface.url)
                        let url = oInterface.url
                        url = url.replace('xmlrpc_bin://', 'http://')
                        url = url.replace('xmlrpc://', 'http://')
                        let oUrl = Url.parse(url)
                        let port = self.portRpl[oInterface.name]
                        if (port === undefined) {
                            port = oUrl.port
                        }
                        let host = (oUrl.hostname === '127.0.0.1') ? self._ccuhost : oUrl.hostname
                        self.log.info('Add %s to the event manager', oInterface.name)
                        self.interfaceEventManager.addInterface(oInterface.name, host, port, oUrl.pathname)

                    }
                })
            } else {
                self.log.error('unable to parse InterfaceList %s', JSON.stringify(list))
            }
            self.interfaceEventManager.init()
            self.interfaceEventManager.connect()
        })

        this.interfaceEventManager.on('event', message => {
            self.sendMessageToSockets({ event: { address: message.address, value: message.value, ts: new Date().getTime() } })
        })
    }
}
