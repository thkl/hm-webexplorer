/*
 * **************************************************************
 * File: RoomManager.js
 * Project: hm-webexplorer-server
 * File Created: Saturday, 13th March 2021 6:43:40 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:33:51 am
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

module.exports = class RoomManager extends Manager {

    constructor(coordinator) {
        super()
        let self = this
        this.coordinator = coordinator

        this.coordinator.addRoute('room/:roomId?', (req, res) => {
            self._handleRequest(req, res)
        })

    }

    async handleGetRequests(body, request, response) {
        let roomList = await this.coordinator.regaManager.fetchRooms()
        response.json({ rooms: roomList })
    }

    async handlePutRequests(body, request, response) {
        let newRoomName = body.newRoomName
        if (newRoomName) {
            await this.coordinator.regaManager.createRoom(newRoomName);
            response.json({ message: 'ok' });
        } else {
            response.json({ error: 'missing newRoomName' })
        }
    }

    async handlePatchRequests(body, request, response) {
        let roomName = body.name
        let roomDescription = body.description
        let roomId = request.params.roomId
        if ((roomName) && (roomId)) {
            let room = this.coordinator.regaManager.roomById(parseInt(roomId));
            if (room) {
                room.name = roomName
                room.description = roomDescription
                this.coordinator.regaManager.saveObject(room).then((result) => {
                    response.json({ message: 'ok' });
                })
            } else {
                response.json({ error: 'room with id ' + roomId + ' not found' })
            }
        } else {
            response.json({ error: 'missing arguments' })
        }
    }

    async handleDeleteRequests(body, request, response) {
        let self = this
        let roomId = request.params.roomId
        let room = this.coordinator.regaManager.roomById(parseInt(roomId));
        if (room) {
            this.coordinator.regaManager.deleteObject(room).then(result => {
                // reload rooms
                self.coordinator.regaManager.fetchRooms().then(() => {
                    self.coordinator.sendMessageToSockets({ system: 'updaterooms' })
                })
                response.json(result);

            })
        } else {
            response.json({ error: 'object not found' })
        }
    }

}