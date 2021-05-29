/*
 * **************************************************************
 * File: index.js
 * Project: hm-webexplorer-server
 * File Created: Thursday, 11th March 2021 7:28:09 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:24:29 am
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




const express = require('express')
const http = require('http')
const https = require('https')
const Coordinator = require('./lib/Coordinator')
const InterfaceManager = require('./lib/InterfaceManager')
const MenuManager = require('./lib/MenuManager')
const DeviceManager = require('./lib/DeviceManager')
const ImageManager = require('./lib/ImageManager')
const VariableManager = require('./lib/VariableManager')
const ServiceManager = require('./lib/ServiceManager')
const ParameterSetManager = require('./lib/ParameterSetManager')
const LinkManager = require('./lib/LinkManager')
const RoomManager = require('./lib/RoomManager')
const FunctionManager = require('./lib/FunctionManager')
const ProgramManager = require('./lib/ProgramManager')
const TimerModuleManager = require('./lib/TimerModuleManager')
const ScriptManager = require('./lib/ScriptManager')
const CoreManager = require('./lib/CoreManager')
const AddonManager = require('./lib/AddonManager');

const HMInterface = require('hm-interface')

let log = HMInterface.logger.logger('API Engine')

const cors = require('cors')
const path = require('path')
const fs = require('fs')
const { request } = require('express')
const program = require('commander')

const apiPort = 1234
const rpcPort = 1235

let keyFile
let host = '127.0.0.1'
let assetHost
let debug = false
let server
let useTLS = false
let configPath

program.option('-D, --debug', 'turn on debug level logging', () => {
    debug = true
})

program.option('-H, --host [hostName]', 'set the ccu to connect', (hostName) => {
    log.info('Host is %s', hostName)
    host = hostName
    assetHost = hostName
})

program.option('-Sc, --secureConn', 'use tls ccu connection', () => {
    useTLS = true
})

program.option('-S, --secure [pem file]', 'use https', (pemFile) => {
    useTLS = true
    keyFile = pemFile
})

program.option('-C, --config [path]', 'set configuration path', (newPath) => {
    configPath = newPath
})

program.parse(process.argv)

const app = express()
app.use(cors())
app.use(express.json())

let staticFiles = path.join(__dirname, '..', 'client', 'dist', 'client')
if (fs.existsSync(staticFiles)) {
    app.use('/', express.static(staticFiles));
} else {
    log.info('%s not exists skipping', staticFiles)
}

if ((useTLS === true) && (fs.existsSync(keyFile)) && (fs.existsSync(keyFile))) {
    log.info('using server cert %s', keyFile)
    const privateKey = fs.readFileSync(keyFile, 'utf8')
    const certificate = fs.readFileSync(keyFile, 'utf8')
    const credentials = { key: privateKey, cert: certificate }
    server = https.createServer(credentials, app)
} else {
    server = http.createServer(app)
}



let coordinator = new Coordinator({ host }, app, server, rpcPort)

if (configPath) {
    coordinator.configPath = configPath
}

if (debug === true) {
    coordinator.setDebug()
}

const interfaceManager = new InterfaceManager(coordinator)
const menuManager = new MenuManager(coordinator)
const deviceManager = new DeviceManager(coordinator)
const imageManager = new ImageManager(coordinator)
if (assetHost) {
    // trust the self signed cert from the ccu
    log.info('Asset Host is %s', assetHost)
    if (useTLS) {
        log.info('we will accept self signed certificates')
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    }
    imageManager.assetHost = assetHost
    imageManager.useTLS = useTLS
}
const roomManager = new RoomManager(coordinator)
const functionManager = new FunctionManager(coordinator)

const variableManager = new VariableManager(coordinator)
const serviceManager = new ServiceManager(coordinator)
const paramsetManager = new ParameterSetManager(coordinator)
const linkManager = new LinkManager(coordinator)
const programManager = new ProgramManager(coordinator)
const timeModuleManager = new TimerModuleManager(coordinator);
const scriptManager = new ScriptManager(coordinator);
const coreManager = new CoreManager(coordinator);
const addonManager = new AddonManager(coordinator);

log.info('Listen on port %s', apiPort)
server.listen(apiPort)

coordinator.regaManager.fetchInterfaces()
coordinator.regaManager.fetchDevices(true)
coordinator.regaManager.fetchRooms()
coordinator.regaManager.fetchFunctions()
coordinator.regaManager.fetchPrograms()
