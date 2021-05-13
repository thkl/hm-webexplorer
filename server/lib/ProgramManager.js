/*
 * **************************************************************
 * File: ProgramManager.js
 * Project: hm-webexplorer-server
 * File Created: Monday, 22nd March 2021 5:28:03 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:33:45 am
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

module.exports = class ProgramManager extends Manager {

    constructor(coordinator) {
        super()
        let self = this
        this.coordinator = coordinator

        this.coordinator.addRoute('program/:programId?', (req, res) => {
            self._handleRequest(req, res)
        })

    }

    async handleGetRequests(body, request, response) {
        let programId = request.params.programId
        if (programId) {
            try {
                let prgDetail = await this.coordinator.regaManager.fetchProgramDetails(programId)
                response.json(prgDetail)
            } catch (e) {
                response.json({ error: programId + ' not found' })
            }
        } else {
            let prgList = await this.coordinator.regaManager.fetchPrograms()
            response.json({ programs: prgList })
        }
    }


    async handlePutRequests(body, request, response) {
        let prgData = body
        console.log(body)
        // Sanitize this !
        let newId = await this.coordinator.regaManager.saveProgram(prgData);
        response.json({ id: newId });
    }

    async handlePatchRequests(body, request, response) {

    }

    async handleDeleteRequests(body, request, response) {
        let programId = request.params.programId
        if (programId) {
            let prgObj = this.coordinator.regaManager.programByid(programId)
            if (prgObj) {
                this.coordinator.regaManager.deleteObject(prgObj).then(async () => {
                    let prgList = await this.coordinator.regaManager.fetchPrograms()
                    response.json({ programs: prgList })
                })
            } else {
                response.json({ error: 'object not found' })
            }
        }
    }

}