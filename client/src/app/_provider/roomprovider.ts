/*
 * **************************************************************
 * File: roomprovider.ts
 * Project: hm-webexplorer-client
 * File Created: Sunday, 21st March 2021 4:57:39 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:38:50 am
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
 * 
 * 
 */
import { CCURoom } from '../_interface/ccu/room';
import { BehaviorSubject, Observable } from 'rxjs';
import { NetworkService } from '../_service/network.service';
import { DataService } from '../_service/data.service';

export class RoomProvider {

    private $roomList: CCURoom[] = new Array<CCURoom>();
    private $roomList$: BehaviorSubject<CCURoom[]>;
    private networkService: NetworkService;
    constructor(
        private dataService: DataService
    ) {
        this.$roomList$ = new BehaviorSubject(new Array<CCURoom>());
        this.networkService = dataService.networkService;
        this.udpateRoomList();
    }

    get roomList(): CCURoom[] {
        return this.$roomList;
    }

    udpateRoomList(): void {
        this.networkService.getJsonData('room')
            .then(result => {
                console.log('ALL Data: ', result);
                const key = 'rooms';
                this.$roomList = result[key];
                this.updateChannels();
                this.$roomList$.next(this.$roomList);
            })
            .catch(error => {
                console.log('Error Getting Data: ', error);
            });
    }

    createRoom(newRoomName: string): void {
        this.networkService.putJsonData('room', { newRoomName }).then(() => {
            this.udpateRoomList();
        });
    }

    removeRoom(roomID: number): Promise<any> {
        return this.networkService.deleteRequest(`room/${roomID}`);
    }

    roomById(roomId): CCURoom {
        let rslt = this.$roomList.filter(room => {
            return (room.id === roomId)
        });
        return (rslt.length > 0) ? rslt[0] : undefined
    }


    subscribeToRoomList(): Observable<CCURoom[]> {
        return this.$roomList$.asObservable();
    }

    updateChannels(): void {
        this.$roomList.forEach(room => {
            room.channelObjects = [];
            room.channels.forEach(channelID => {
                const chnl = this.dataService.deviceProvider.channelWithId(channelID);
                if (chnl) {
                    room.channelObjects.push(chnl);
                }
            });
        })
    }


    updateRoomFromNetwork(data: any): void {
        if (data) {
            let oRoom = this.roomById(data.id);
            if (oRoom) {
                oRoom.name = data.name;
                oRoom.channels = data.channels;
            }
        }
    }

    saveRoom(data: any): void {
        this.networkService.patchJsonData(`room/${data.id}`, { name: data.name, description: data.description })
    }
}