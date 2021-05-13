/*
 * **************************************************************
 * File: ImageManager.js
 * Project: hm-webexplorer-server
 * File Created: Friday, 12th March 2021 7:01:17 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:33:11 am
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
const http = require('http');

module.exports = class ImageManager extends Manager {

    constructor(coordinator) {
        super()
        let self = this
        this.imageCache = {}
        this.coordinator = coordinator

        this.coordinator.addRoute('image/:devicetype/:size?/:redirect?/', (req, res) => {
            self._handleRequest(req, res)
        })

    }

    fetchDevFile(url) {
        return new Promise((resolve, reject) => {
            http.get(url, (res) => {
                const { statusCode } = res;
                const contentType = res.headers['content-type'];

                let error;

                if (error) {
                    console.error(error.message);
                    // Consume response data to free up memory
                    res.resume();
                    return;
                }

                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => {
                    try {
                        resolve(rawData)
                    } catch (e) {
                        reject(e)
                    }
                });
            }).on('error', (e) => {
                reject(e)
            });
        })
    }


    getDeviceImageURL(hostname, deviceType, size) {
        let self = this
        return new Promise((resolve, reject) => {
            let url = 'http://' + self.coordinator.ccuHost + '/config/devdescr/DEVDB.tcl'
            if (self.imageCache[deviceType] === undefined) {
                let devData = self.fetchDevFile(url).then(response => {
                    const tclArr = response.match(/array set DEV_PATHS\s([^\n]+)/)[1].trim()
                    const arr = tclArr.match(/([\s{][^\s]+) \{\{50 ([^\s^}]+)\} \{250 ([^\s^}]+)}/g)
                    if (arr) {

                        let m;
                        const regex = /([\s{][^\s]+) \{\{50 ([^\s^}]+)\} \{250 ([^\s^}]+)}/g;
                        while ((m = regex.exec(arr)) !== null) {
                            if (m.index === regex.lastIndex) {
                                regex.lastIndex++;
                            }
                            let devType = m[1].trim().replace("{", "")
                            let smImage = m[2]
                            let bgImage = m[3]

                            self.imageCache[devType] = { big: bgImage, small: smImage }

                        }

                        let imgUrl = `http://${hostname}/${self.imageCache[deviceType][size || 'small']}`
                        resolve(imgUrl)
                    } else {
                        resolve('')
                    }
                })
            } else {
                let imgUrl = `http://${hostname}/${self.imageCache[deviceType][size || 'small']}`
                resolve(imgUrl)
            }
        })
    }

    async handleGetRequests(body, request, response) {
        let deviceType = request.params.devicetype
        let redirect = request.params.redirect
        let size = request.params.size
        const url = require('url');
        let urlObject = new URL(`http://${request.headers.host}`)

        if (this.assetHost) {
            urlObject = new URL(`http://${this.assetHost}`)
        }

        this.getDeviceImageURL(urlObject.hostname, deviceType, size).then(result => {
            if ((redirect) && (redirect === 'true')) {
                response.redirect(result)
            } else {
                response.json({ image: result })
            }
        })
    }

}