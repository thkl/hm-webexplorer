/*
 * **************************************************************
 * File: deviceprovider.ts
 * Project: hm-webexplorer-client
 * File Created: Sunday, 21st March 2021 4:34:25 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:39:08 am
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
import { CCUDevice } from '../_interface/ccu/device';
import { BehaviorSubject } from 'rxjs';
import { NetworkService, RPCPutParamsetResult } from '../_service/network.service';
import { Observable, Observer } from 'rxjs';
import { CCUChannel } from '../_interface/ccu/channel';
import { CCUInterfaceLinks } from '../_interface/ccu/interfacelinks';
import { CCUDirectlink } from '../_interface/ccu/directlink';
import { CCUDatapoint } from '../_interface/ccu/datapoint';
import { DataService } from '../_service/data.service';

export class DeviceProvider {

    private $deviceList: CCUDevice[] = new Array<CCUDevice>();
    private $deviceList$: BehaviorSubject<CCUDevice[]>;

    private $datapointList: CCUDatapoint[];

    private $directLinkUIOptions: any;

    private $linkList: CCUInterfaceLinks[];
    private $linkList$: BehaviorSubject<CCUInterfaceLinks[]>;
    private networkService: NetworkService;

    private $deviceTeachInUpdater: any;
    constructor(
        private dataService: DataService
    ) {
        this.$deviceList$ = new BehaviorSubject(new Array<CCUDevice>());
        this.$linkList$ = new BehaviorSubject(new Array<CCUInterfaceLinks>());
        this.networkService = this.dataService.networkService;

        // subscribe to the servicemessages


        this.dataService.subscribeToServiceMessageList().subscribe((newList) => {
            const triggerIds = [];
            newList.forEach(listItem => {
                let device = this.deviceWithId(listItem.triggerDeviceID)
                if (device) {
                    device.serviceMessage = true
                }
                triggerIds.push(listItem.triggerDeviceID)
            })
            // reset al other devices
            this.$deviceList.forEach(device => {
                if (triggerIds.indexOf(device.id) === -1) {
                    device.serviceMessage = false;
                }
            })
        });
        this.refresh();
    }

    refresh() {
        if (this.networkService.serverUrl !== undefined) {
            console.log('Refreshing DeviceProvider ...')
            this.networkService.getJsonData('config/options').then(list => { this.$directLinkUIOptions = list; });
            this.updateDeviceList();
        }
    }

    updateDeviceList(): void {
        this.networkService.getJsonData('device')
            .then(result => {
                console.log('Devices ALL Data: ', result);
                const key = 'devices';
                this.$datapointList = [];
                this.$deviceList = result[key];
                // loop thru all channels and set some additional data
                this.$deviceList.forEach(device => {
                    device.channels.forEach(channel => {
                        channel.parentId = device.id;
                        channel.deviceType = device.type;
                        channel.datapoints.forEach(datapoint => {
                            datapoint.parentChannel = channel.id;
                            this.$datapointList.push(datapoint);
                            datapoint.rawUnit = unescape(datapoint.rawUnit);
                            datapoint.unit = unescape(datapoint.unit);
                        });
                        this.updateChannelRoomFckNames(channel);

                    });
                });
                this.$deviceList$.next(this.$deviceList);
            })
            .catch(error => {
                console.log('Error Getting Data: ', error);
            });
    }

    get deviceList(): CCUDevice[] {
        return this.$deviceList;
    }

    updateChannelRoomFckNames(channel: CCUChannel): void {
        channel.roomNames = [];
        channel.rooms.forEach(roomId => {
            const room = this.dataService.roomProvider.roomById(roomId);
            if (room) {
                channel.roomNames.push(room.name);
            }
        });

        channel.functionNames = [];
        channel.functions.forEach(fckId => {
            const fck = this.dataService.functionProvider.functionById(fckId);
            if (fck) {
                channel.functionNames.push(fck.name);
            }
        });

    }

    subscribeToDeviceList(): Observable<CCUDevice[]> {
        return this.$deviceList$.asObservable();
    }

    deviceWithId(deviceId: number): CCUDevice {
        let result: CCUDevice;
        this.$deviceList.forEach(device => {
            if (device.id === deviceId) {
                result = device;
            }
        });
        return result;
    }

    teachInDevice(ifId: number): Promise<any> {
        return new Promise((resolve) => {
            clearInterval(this.$deviceTeachInUpdater);
            this.$deviceTeachInUpdater = setInterval(() => {
                this.updateDeviceList();
            }, 5000);
            this.networkService.postJsonData('device/new/' + String(ifId), {}).then(() => {
                setTimeout(() => {
                    clearInterval(this.$deviceTeachInUpdater);
                    resolve(null);
                }, 60000);
            });
        });
    }

    cancelTeachIn(ifId: number): Promise<any> {
        return new Promise((resolve) => {
            clearInterval(this.$deviceTeachInUpdater);
            this.networkService.postJsonData('device/new/' + String(ifId), { stop: true }).then(() => {
                resolve(null);
            });
        });
    }


    deviceWithSerial(serial: string): CCUDevice {
        let result: CCUDevice;
        this.$deviceList.forEach(device => {
            if (device.serial === serial) {
                result = device;
            }
        });
        return result;
    }

    channelWithAddress(address: string): CCUChannel {
        let result: CCUChannel;
        this.$deviceList.forEach(device => {
            device.channels.forEach(channel => {
                if (channel.address === address) {
                    result = channel;
                }
            });
        });
        return result;
    }


    channelWithId(channelId: number): CCUChannel {
        let result: CCUChannel;
        this.$deviceList.forEach(device => {
            device.channels.forEach(channel => {
                if (channel.id === channelId) {
                    result = channel;
                }
            });
        });
        return result;
    }

    datapointWithId(datapointId: number): CCUDatapoint {
        if (this.$datapointList) {
            const rslt = this.$datapointList.filter(datapoint => {
                return (datapoint.id === datapointId);
            });
            if (rslt.length > 0) {
                return rslt[0];
            } else {
                return undefined;
            }
        } else { return undefined; }
    }

    datapointWithName(name: string): CCUDatapoint {
        if (this.$datapointList) {
            const rslt = this.$datapointList.filter(datapoint => {
                return (datapoint.name === name);
            });
            if (rslt.length > 0) {
                return rslt[0];
            } else {
                return undefined;
            }
        } else { return undefined; }
    }

    deviceWithChannelId(channelId: number): CCUDevice {
        let result: CCUDevice;
        this.$deviceList.forEach(device => {
            device.channels.forEach(channel => {
                if (channel.id === channelId) {
                    result = device;
                }
            });
        });
        return result;
    }

    getProgramIDsForDevice(device: CCUDevice): Promise<any> {
        return new Promise((resolve) => {
            this.networkService.getJsonData('device/' + device.id + '/progs').then((result) => {
                resolve(result);
            });
        });
    }

    removeLinkForDevice(device: CCUDevice, sender: string, recevier: string): Promise<any[]> {
        return this.networkService.deleteRequest(`device/${device.serial}/removelink/${sender}/${recevier}`);
    }

    getLinksForDevice(device: CCUDevice): Promise<CCUDirectlink[]> {
        return this.networkService.getJsonData(`device/${device.serial}/links`);
    }

    getLinkOptions(key: string, category?: string): any {
        const genericKey = 'GENERIC';
        if (category === undefined) {
            category = genericKey;
        }
        let optionsByCat = this.$directLinkUIOptions[category];
        if (optionsByCat === undefined) {
            optionsByCat = this.$directLinkUIOptions[genericKey];
        }
        const result = optionsByCat[key];
        return result;
    }


    updateDirectLinks(): Promise<any> {
        return new Promise(resolve => {
            const key = 'links';
            this.networkService.getJsonData(key).then(result => {
                console.log('ALL Data: ', result);
                if (result) {
                    this.$linkList = result;
                    this.$linkList$.next(this.$linkList);
                    resolve(result);
                }
            });
        })
    }

    get directLinks(): CCUInterfaceLinks[] {
        return this.$linkList;
    }

    subscribeToDirectLinkList(): Observable<CCUInterfaceLinks[]> {
        return this.$linkList$.asObservable();
    }

    lookupDevicesForLink(link: CCUDirectlink): CCUDirectlink {

        const sndrDevice = link.SENDER.split(':')[0];
        const recvDevice = link.RECEIVER.split(':')[0];

        let oDevice = this.deviceWithSerial(sndrDevice);
        if (oDevice) {
            link.senderDevice = oDevice;
        }

        oDevice = this.deviceWithSerial(recvDevice);
        if (oDevice) {
            link.recvDevice = oDevice;
        }

        let oChannel = this.channelWithAddress(link.SENDER);
        if (oChannel) {
            link.cSender = oChannel;
        }

        oChannel = this.channelWithAddress(link.RECEIVER);
        if (oChannel) {
            link.cReceiver = oChannel;
        }

        return link;
    }

    // utilitites

    sortObjectByKeys(o: any): any {
        return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
    }

    sortObjectByStringKeys(o: any): any {
        return Object.keys(o).sort((a, b) => {
            if (parseFloat(a) < parseFloat(b)) { return -1; }
            if (parseFloat(a) > parseFloat(b)) { return 1; }
            return 0;
        }).reduce((r, k) => (r[k] = o[k], r), {});
    }


    removeDevice(serial: string): Promise<any> {
        return this.networkService.deleteRequest(`device/${serial}`).then(() => {
            this.updateDeviceList();
        });
    }


    saveDeviceParamSets(data: any): Promise<any> {
        const paramsets = data.paramsets;
        let pending = false;
        const putOperations = []; // Buffer for Promise.all
        return new Promise(resolve => {
            Object.keys(paramsets).forEach(async (setId) => { // Loop thru all paramsets
                const set = paramsets[setId];
                // build the set values
                const masterSet = {};
                const valueKey = 'VALUE';
                const op = new Promise(async (resolvePut) => { // create a new operation
                    Object.keys(set).forEach(setKey => { // collect all values into a new buffer
                        masterSet[setKey] = set[setKey][valueKey];
                    });
                    const result = await this.networkService.putJsonData(`paramset/${data.serial}/${setId}/MASTER`, // save to api
                        masterSet) as RPCPutParamsetResult;
                    if (result.error !== undefined) {
                        if (result.error.code === -10) {
                            pending = true;
                        }
                    }
                    resolvePut(null);
                });
                putOperations.push(op);
            });

            Promise.all(putOperations).then(() => {
                resolve(pending);
            });

        });
    }

    updateDeviceFromNetwork(data: any): void {
        if (data) {
            const oDevice = this.deviceWithId(data.id);
            if (oDevice) {
                oDevice.name = data.name;
                oDevice.visible = data.visible;
                oDevice.inuse = data.inuse;
                oDevice.enabled = data.enabled;
                oDevice.access = data.access;
                oDevice.readyconfig = data.readyconfig;
                oDevice.readyconfigchannels = data.readyconfigchannels;
            }
        }
    }

    updateChannelFromNetwork(data: any): void {
        if (data) {
            const oChannel = this.channelWithId(data.id);
            if (oChannel) {
                oChannel.name = data.name;
                oChannel.rooms = data.rooms;
                oChannel.functions = data.functions;
            } else {
                console.log('Channel not found to update')
            }
        }
    }


    updateRSSI(data: any): void {
        let adr = data['adr']
        let status = data['status']
        let device = this.deviceWithSerial(adr);
        if (device) {


            const rssipeer = 'RSSI_PEER';
            const rssdev = 'RSSI_DEVICE';
            const voltagekey = 'OPERATING_VOLTAGE';
            if (status[rssdev] === -65535) {
                device.rssi = status[rssipeer];
            } else {
                device.rssi = status[rssdev];
            }

            device.voltage = status[voltagekey];
        }
    }

    filterChannelList(channels: CCUChannel[], options: any): CCUChannel[] {
        return channels.filter((channel) => {

            if (options.fltr) {
                if ((channel.name.toLowerCase().indexOf(options.fltr.toLowerCase()) === -1) &&
                    (channel.roomNames.join(',').toLowerCase().indexOf(options.fltr.toLowerCase()) === -1)) {
                    return false;
                }
            }

            let result = (
                (((channel.isReadable) && (options.isReadable)) ||
                    ((channel.isWritable) && (options.isWritable)) ||
                    ((channel.isEventable) && (options.isEventable)))
            )

            if ((channel.isVirtual) && (options.isVirtual === false)) { result = false; }

            return result;
        })
    }

    removeRoomFromChannel(channelId: number, roomId: number): Promise<any> {
        return new Promise(async (resolve) => {
            const channel = this.channelWithId(channelId);
            if (channel) {
                channel.rooms = channel.rooms.filter(croomid => {
                    return croomid !== roomId;
                });
                const deviceId = channel.parentId
                const device = this.deviceWithId(deviceId);
                await this.saveDevice(device);
                this.updateChannelRoomFckNames(channel);
                resolve(device);
            } else {
                console.log('channel for id %s not found', channelId)
            }
        })
    }

    addRoomToChannel(channelId: number, roomId: number): Promise<any> {
        return new Promise(async (resolve) => {
            const channel = this.channelWithId(channelId);
            if (channel) {
                channel.rooms.push(roomId);
                const deviceId = channel.parentId
                const device = this.deviceWithId(deviceId);
                await this.saveDevice(device);
                this.updateChannelRoomFckNames(channel);
                resolve(device);
            } else {
                console.log('channel for id %s not found', channelId)
            }
        })
    }


    removeFunctionFromChannel(channelId: number, functionId: number): Promise<any> {
        return new Promise(async (resolve) => {
            const channel = this.channelWithId(channelId);
            if (channel) {
                channel.functions = channel.functions.filter(cfckid => {
                    return cfckid !== functionId;
                });
                const deviceId = channel.parentId
                const device = this.deviceWithId(deviceId);
                await this.saveDevice(device);
                this.updateChannelRoomFckNames(channel);
                resolve(device);
            } else {
                console.log('channel for id %s not found', channelId)
            }
        })
    }

    addFunctionToChannel(channelId: number, functionId: number): Promise<any> {
        return new Promise(async (resolve) => {
            const channel = this.channelWithId(channelId);
            if (channel) {
                channel.functions.push(functionId);
                const deviceId = channel.parentId
                const device = this.deviceWithId(deviceId);
                await this.saveDevice(device);
                this.updateChannelRoomFckNames(channel);
                resolve(device);
            } else {
                console.log('channel for id %s not found', channelId)
            }
        })
    }

    saveDevice(data: any): Promise<any> {
        return new Promise(async (resolve) => {
            const channels = [];
            data.channels.forEach(channel => {
                channels.push({ id: channel.id, name: channel.name, rooms: channel.rooms, functions: channel.functions });
            });
            let method = `device/${data.id}`;
            if (data.setReady) {
                method = method + '/setReady';
            }
            await this.networkService.patchJsonData(method, { name: data.name, channels }).then((result) => {
                resolve(result);
            });

            if (data.paramsets !== undefined) {
                const pending = await this.saveDeviceParamSets(data);
                if (pending) {
                    this.dataService.onInterfaceMessage.emit('There are pending transmissions to your devices. Please put them into learning mode. Otherwise changes will be delayed.');
                }
            }
        });
    }

    hasEmptyStates(device: CCUDevice): boolean {
        let result = false;
        device.channels.forEach(channel => {
            channel.datapoints.forEach(dp => {
                if (dp.lastChange === undefined) {
                    result = true;
                }
            })
        })
        return result;
    }

    fetchDeviceStates(device: CCUDevice): Promise<any> {
        return new Promise(resolve => {
            this.networkService.getJsonData(`device/${device.id}/state`).then(result => {
                if (result) {
                    result.forEach(state => {
                        let dpn = state.name;
                        let dp = this.datapointWithName(dpn);
                        if (dp) {
                            dp.lastChange = state.ts
                            dp.value = state.state;
                        }
                    });
                }
                resolve(device);
            })
        })
    }
}