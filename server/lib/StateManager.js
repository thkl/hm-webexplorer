const Manager = require('./Manager.js')
const HMInterface = require('hm-interface')

const CCUDirectLink = require('./CCUDirectLink.js')

module.exports = class StateManager extends Manager {


    constructor(coordinator) {
        super()
        let self = this
        this.coordinator = coordinator

        this.coordinator.addRoute('state/:id?/', (req, res) => {
            self._handleRequest(req, res)
        })



    }

    async handleGetRequests(body, request, response) {
        let deviceID = request.params.id
        let device = this.coordinator.regaManager.deviceByidOrSerial(deviceID)
        if (device) {
            let states = await this.coordinator.regaManager.updateDeviceStatesWithId(device.id);
            response.json(states)
        } else {
            response.json({ error: 'device not found' })
        }
    }

    async handlePutRequests(body, request, response) {
        let datapointName = request.params.id
        let newState = body.newState
        let result = await this.coordinator.regaManager.setDatapointState(datapointName, newState)
        response.json(result)
    }
}