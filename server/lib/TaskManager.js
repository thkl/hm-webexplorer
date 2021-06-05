/*
 * **************************************************************
 * File: TaskManager.js
 * Project: hm-webexplorer-server
 * File Created: Thursday, 15th April 2021 4:19:49 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:34:02 am
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

const path = require('path');
const fs = require('fs');

module.exports = class TaskManager {


    constructor(coordinator) {
        this.coordinator = coordinator
        this.tasks = {}
    }

    addTask(name, callback, interval, runFirst = false) {
        let self = this
        this.tasks[name] = { timer: setInterval(() => { callback(self) }, interval), callback: callback }
        if (runFirst) {
            callback(this)
        }
    }


    startTasks() {
        this.addTask('deviceUpdater', this.updateDeviceStatus, 90000, true)
        this.addTask('serviceUpdater', this.updateServiceMessages, 30000, true)
        this.addTask('systemUpdater', this.updateSystemInfo, 60000, true)
    }

    stopTasks() {
        Object.entries(this.tasks).forEach(entry => {
            const [key, value] = entry;
            if (value.timer) {
                clearInterval(value.timer)
            }
        })
    }

    performTask(name) {
        let task = this.tasks[name];
        if ((task) && (task.callback)) {
            task.callback(this);
        }
    }


    updateDeviceStatus(owner) {
        if (owner.coordinator.hazClients()) {
            return new Promise(async (resolve) => {
                let deviceList = await owner.coordinator.regaManager.fetchDevices()
                deviceList.forEach(async device => {
                    let adr = device.serial + ':0'
                    let status = await self.coordinator.rpcManager.rpcCall(device.interface, 'getParamset', [adr, 'VALUES']);
                    owner.coordinator.sendMessageToSockets({ deviceStatus: { adr: device.serial, status: status } });
                });
            })
        }
    }

    updateSystemInfo(owner) {
        if (owner.coordinator.hazClients()) {
            return new Promise(async (resolve) => {
                let result = {}
                // Time // Sunset / SunRise / Firmware / DutyCycle
                result.times = await owner.coordinator.regaManager.fetchTimes()
                // Firmware is in /boot/VERSION
                let fNVersion = path.join('/', 'boot', 'VERSION')
                if (fs.existsSync(fNVersion)) {
                    let fnVContent = fs.readFileSync(fNVersion)
                    result.version = fnVContent.toString().match(/VERSION=([.a-zA-Z0-9]{1,})/)[1]
                }
                // DC is located in /tmp/dutycycle.json
                let fnDc = path.join('/', 'tmp', 'dutycycle.json')
                if (fs.existsSync(fnDc)) {
                    result.dutycycle = JSON.parse(fs.readFileSync(fnDc))
                }
                owner.coordinator.sendMessageToSockets({ systemStatus: result });
            })
        }
    }

    updateServiceMessages(owner) {
        if (owner.coordinator.hazClients()) {
            return new Promise(async (resolve) => {
                let serviceList = await owner.coordinator.regaManager.fetchServiceMessages()
                owner.coordinator.sendMessageToSockets({ service: serviceList })

            })
        }
    }

}