const Manager = require('./Manager.js')
const path = require('path')
const fs = require('fs')
const sonos = require('sonos')

module.exports = class SonosManager extends Manager {

    constructor(coordinator) {
        super()
        let self = this
        this.coordinator = coordinator
        this.sonosDevices = {};
        this.coordinator.addRoute('sonos/:action/:option?', (req, res) => {
            self._handleRequest(req, res)
        })
        console.log('Startup Sonos Manager')
        /*
                try {
                    const listener = sonos.Listener
                    listener.on('AlarmClock', result => {
                        console.log('Alarms changed event %j', result)
                    })
        
                    listener.on('ZoneGroupTopology', result => {
                        console.log('Zone group topology event, got info about all current groups')
                    })
        
                    // Manually subscribe to a events from a sonos speaker
                    listener.subscribeTo(sonos).then(result => {
                        console.log('Manually subscribed to sonos events')
                    })
                } catch (e) {
                    console.log('Sonos Listener Error')
                    console.log(e)
                }
                */
    }

    addSonosDevice(hostIp) {
        const Sonos = sonos.Sonos
        if (this.sonosDevices[hostIp] === undefined) {

            let sd = new Sonos(hostIp);
            this.sonosDevices[hostIp] = sd
            sd.on('NextTrack', track => {
                console.log('The next track will be %s by %s', track.title, track.artist)
            })
            sd.on('PlayState', state => {
                console.log('The state changed to %s.', state)
            })
            return true
        }
        return false

    }

    async handleGetRequests(body, request, response) {
        let action = request.params.action
        let option = request.params.option
        switch (action) {
            case 'add':
                let result = this.addSonosDevice(option)
                response.json({ 'result': result })
                break
        }
    }
}