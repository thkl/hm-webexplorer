/*
 * **************************************************************
 * File: Manager.js
 * Project: hm-webexplorer-server
 * File Created: Thursday, 11th March 2021 8:23:50 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:33:29 am
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

module.exports = class Manager {


    _handleRequest(request, response) {
        if (request.method === 'GET') {
            this.handleGetRequests(request.query, request, response)
        }

        if (request.method === 'PUT') {
            this.handlePutRequests(request.body, request, response)
        }

        if (request.method === 'POST') {
            this.handlePostRequests(request.body, request, response)
        }

        if (request.method === 'DELETE') {
            this.handleDeleteRequests(request.body, request, response)
        }

        if (request.method === 'PATCH') {
            this.handlePatchRequests(request.body, request, response)
        }
    }


    async handleGetRequests(body, request, response) {
    }

    async handlePostRequests(body, request, response) {
    }

    async handlePutRequests(body, request, response) {
    }

    async handleDeleteRequests(body, request, response) {
    }

    async handlePatchRequests(body, request, response) {
    }
}