const Manager = require('./Manager.js')
const path = require('path')
const fs = require('fs')

module.exports = class CoreManager extends Manager {

    constructor(coordinator) {
        super()
        let self = this
        this.coordinator = coordinator

        this.coordinator.addRoute('core/:action/:option?', (req, res) => {
            self._handleRequest(req, res)
        })
    }



    async handleGetRequests(body, request, response) {
        let action = request.params.action
        let option = request.params.option
        switch (action) {
            case 'log':
                let logFile = 'messages'
                switch (option) {
                    case 'syslog':
                        logFile = 'messages'
                        break
                    case 'hmserver':
                        logFile = 'hmserver.log'
                        break
                    case 'http-error':
                        logFile = 'lighttpd-error.log'
                        break
                    case 'http-access':
                        logFile = 'lighttpd-access.log'
                        break
                    default:
                        logFile = 'messages'

                }
                let logPath = path.join('/', 'var', 'log', logFile)
                if (fs.existsSync(logPath)) {
                    response.sendFile(logPath)
                } else {
                    response.end('404 ' + logPath)
                }
        }
    }

}