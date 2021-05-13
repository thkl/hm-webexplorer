/*
 * **************************************************************
 * File: InterfaceManager.js
 * Project: hm-webexplorer-server
 * File Created: Thursday, 11th March 2021 7:28:52 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:33:17 am
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

module.exports = class InterfaceManager extends Manager {

    constructor(coordinator) {
        super()
        let self = this
        this.coordinator = coordinator

        this.coordinator.addRoute('interface/:interfaceid?/:action?', (req, res) => {
            self._handleRequest(req, res)
        })

    }

    async handleGetRequests(body, request, response) {
        let interfaceid = request.params.interfaceid
        let action = request.params.action
        if (interfaceid) {
            let oInterface = this.coordinator.regaManager.interfaceByid(parseInt(interfaceid))
            if (oInterface) {

                switch (action) {
                    default:
                        let methods = this.coordinator.rpcManager.allowedMethods(parseInt(interfaceid))
                        oInterface.methods = methods
                        response.json({ interface: oInterface })
                }

            } else {
                response.json({ error: 'interface ' + interfaceid + ' not found' })
            }
        } else {
            let interfaceList = await this.coordinator.regaManager.fetchInterfaces()
            response.json({ interfaces: interfaceList })
        }
    }

}