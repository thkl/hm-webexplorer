/*
 * **************************************************************
 * File: MenuManager.js
 * Project: hm-webexplorer-server
 * File Created: Thursday, 11th March 2021 8:39:11 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:33:34 am
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
const path = require('path')
const fs = require('fs')

module.exports = class MenuManager extends Manager {

    constructor(coordinator) {
        super()
        let self = this
        this.coordinator = coordinator

        this.coordinator.addRoute('menu', (req, res) => {
            self._handleRequest(req, res)
        })
    }

    getDefaultMenu() {
        return [

            {
                id: "devices",
                title: "Devices",
                icon: "lightbulb"
            },
            {
                id: "variables",
                title: "Variables",
                icon: "paint-bucket"
            },
            {
                id: 'enum',
                title: 'Enumerations',
                children: [
                    {
                        id: "rooms",
                        title: "Rooms",
                        icon: "room"
                    },
                    {
                        id: "functions",
                        title: "Functions",
                        icon: "graph"
                    }
                ],
                icon: "list-rich"
            },
            {
                id: "automation",
                title: "Automation",
                icon: "object-group"
            },
            {
                id: "system",
                title: "System",
                icon: "cog",
                children: [
                    {
                        id: "interfaces",
                        title: "Hardware Interfaces",
                        icon: "lan"
                    },
                    {
                        id: "system-log",
                        title: "CCU Log",
                        icon: "spreadsheet"
                    }
                ]
            }
        ]
    }

    loadMenu() {

        if (this.coordinator.configPath === undefined) {
            return (this.getDefaultMenu())
        }

        const menuFile = path.join(this.coordinator.configPath, 'menu.json')
        let menu = []
        try {
            if (fs.existsSync(menuFile)) {
                let fMenu = JSON.parse(fs.readFileSync(menuFile))
                if (fMenu) {
                    menu = fMenu
                }
            } else {
                menu = this.getDefaultMenu()
            }
        } catch (e) {

        }
        const addOnFile = path.join(this.coordinator.configPath, 'addons.json')
        if (fs.existsSync(addOnFile)) {
            let addonList = []
            let addons = JSON.parse(fs.readFileSync(addOnFile))
            if (addons) {
                addons.forEach(addon => {
                    addonList.push(addon)
                })
            }
            if (addonList.length > 0) {
                menu.push({ id: 'addons', title: 'AddOns', icon: 'applications-settings', children: addonList })
            }
        }

        return menu
    }

    async handleGetRequests(body, request, response) {
        response.json({ menu: this.loadMenu() })
    }

}