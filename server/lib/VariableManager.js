/*
 * **************************************************************
 * File: VariableManager.js
 * Project: hm-webexplorer-server
 * File Created: Sunday, 14th March 2021 4:25:42 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:34:16 am
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

module.exports = class VariableManager extends Manager {

    constructor(coordinator) {
        super()
        let self = this
        this.coordinator = coordinator

        this.coordinator.addRoute('variable/:variableid?/:action?', (req, res) => {
            self._handleRequest(req, res)
        })

        this.coordinator.regaManager.fetchVariables()
    }

    async handleGetRequests(body, request, response) {
        let variableID = request.params.variableid
        let action = request.params.action

        if (variableID === undefined) {
            let variableList = await this.coordinator.regaManager.fetchVariables()
            response.json({ variables: variableList })
        } else {
            switch (action) {
                case 'value':
                    try {
                        let variable = this.coordinator.regaManager.variableByid(variableID);
                        if (variable === undefined) { // try find variable by ID
                            variable = this.coordinator.regaManager.variableByName(variableID);
                        }
                        if (variable !== undefined) { // if not find by name
                            let varVal = await this.coordinator.regaManager.fetchVariableState(variable.id);
                            response.json({ state: varVal })
                        } else {
                            response.json({ error: 404 })
                        }
                    } catch (e) {
                        console.log(e)
                        response.json({ error: -1, msg: e })
                    }
                    break;
                default:
                    let varData = await this.coordinator.regaManager.fetchVariablesbyIDs([variableID]);
                    response.json({ variable: varData })
            }
        }
    }

    async handlePatchRequests(body, request, response) {
        let variableID = request.params.variableid
        let action = request.params.action
        if (variableID !== undefined) {

            if (action === undefined) {
                if (body.variable !== undefined) {
                    await this.coordinator.regaManager.updateVariable(variableID, body.variable)
                }

                if (body.variable._state !== undefined) {
                    await this.coordinator.regaManager.setVariableState(variableID, body.variable._state)
                }

                let varData = await this.coordinator.regaManager.fetchVariablesbyIDs([variableID]);
                this.coordinator.sendMessageToSockets({ variable: varData })
                response.json({ result: true })
            }

            if (action === 'value') {
                let newState = body.state
                if (newState !== undefined) {
                    let result = await this.coordinator.regaManager.setVariableState(variableID, newState)
                    response.json(result)
                } else {
                    response.json({ error: -1 })
                }
            }
        }
    }

}