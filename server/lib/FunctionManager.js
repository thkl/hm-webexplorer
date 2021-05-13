/*
 * **************************************************************
 * File: FunctionManager.js
 * Project: hm-webexplorer-server
 * File Created: Sunday, 21st March 2021 7:39:42 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:33:04 am
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

module.exports = class FunctionManager extends Manager {

    constructor(coordinator) {
        super()
        let self = this
        this.coordinator = coordinator

        this.coordinator.addRoute('function/:functionId?', (req, res) => {
            self._handleRequest(req, res)
        })

    }

    async handleGetRequests(body, request, response) {
        let functionList = await this.coordinator.regaManager.fetchFunctions()
        response.json({ functions: functionList })
    }

    async handlePutRequests(body, request, response) {
        let newFunctionName = body.newFunctionName
        if (newFunctionName) {
            await this.coordinator.regaManager.createFunction(newFunctionName);
            response.json({ message: 'ok' });
        } else {
            response.json({ error: 'missing newFunctionName' })
        }
    }

    async handlePatchRequests(body, request, response) {
        let fckName = body.name
        let fckDescription = body.description
        let fckId = request.params.functionId
        if ((fckName) && (fckId)) {
            let fckt = this.coordinator.regaManager.functionById(parseInt(fckId));
            if (fckt) {
                fckt.name = fckName
                fckt.description = fckDescription
                this.coordinator.regaManager.saveObject(fckt).then((result) => {
                    response.json({ message: 'ok' });
                })
            } else {
                response.json({ error: 'function with id ' + fckId + ' not found' })
            }
        } else {
            response.json({ error: 'missing arguments' })
        }
    }

    async handleDeleteRequests(body, request, response) {
        let self = this
        let functionId = request.params.functionId
        let oFunction = this.coordinator.regaManager.functionById(parseInt(functionId));
        if (oFunction) {
            this.coordinator.regaManager.deleteObject(oFunction).then(result => {
                // reload rooms
                self.coordinator.regaManager.fetchFunctions().then(() => {
                    self.coordinator.sendMessageToSockets({ system: 'updatefunctions' })
                })
                response.json(result);

            })
        } else {
            response.json({ error: 'object not found' })
        }
    }

}