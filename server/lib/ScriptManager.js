/*
 * **************************************************************
 * File: ScriptManager.js
 * Project: hm-webexplorer-server
 * File Created: Saturday, 15th May 2021 3:48:18 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Saturday, 15th May 2021 3:53:55 pm
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

module.exports = class ScriptManager extends Manager {

    constructor(coordinator) {
        super()
        let self = this
        this.coordinator = coordinator

        this.coordinator.addRoute('script/:action?', (req, res) => {
            self._handleRequest(req, res)
        })
    }


    async handlePostRequests(body, request, response) {
        let action = request.params.action
        if (body.script) {
            let script = unescape(body.script)
            if (action === 'test') {
                let rslt = await this.coordinator.regaManager.scriptSyntaxCheck(script)
                response.json(rslt)
            } else {
                let rslt = await this.coordinator.regaManager.script(script)
                response.json({ STDOUT: escape(rslt) })
            }
        }
    }
}