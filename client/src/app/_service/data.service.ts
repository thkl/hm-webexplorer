/*
 * **************************************************************
 * File: data.service.ts
 * Project: hm-webexplorer-client
 * File Created: Saturday, 13th March 2021 7:26:55 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:38:33 am
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
import { EventEmitter, Injectable } from '@angular/core';
import { CCUInterface } from '../_interface/ccu/interface';
import { CCUServicemessage } from '../_interface/ccu/servicemessage';
import { NetworkConnection, NetworkService, NetworkStatus } from './network.service';
import { Observable, Observer } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { SocketOne } from './socket';
import { DeviceProvider } from '../_provider/deviceprovider';
import { RoomProvider } from '../_provider/roomprovider';
import { FunctionProvider } from '../_provider/functionprovider';
import { ProgramProvider } from '../_provider/programprovider';
import { VariableProvider } from '../_provider/variableprovider';
import { LocalizationService } from './localization_service';
import { UIProvider } from '../_provider/uiprovider';
import { CCUEvent } from '../_interface/ccu/event';
import { CoreProvider } from '../_provider/coreprovider';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DataService {


  private $interfaceList: CCUInterface[] = new Array<CCUInterface>();
  private $interfaceList$: BehaviorSubject<CCUInterface[]>;

  private $serviceMessageList: CCUServicemessage[];
  private $serviceMessageList$: BehaviorSubject<CCUServicemessage[]>;

  private $oldMessageCount: number;
  private $ccuHost: string;

  public cacheChanged = new EventEmitter<string>();
  public onInterfaceMessage = new EventEmitter<string>();

  private socket: SocketOne;
  private $onChangeObject = new EventEmitter<any>();

  private $deviceProvider: DeviceProvider;
  private $roomProvider: RoomProvider;
  private $functionProvider: FunctionProvider;
  private $programProvider: ProgramProvider;
  private $variableProvider: VariableProvider;
  private $coreProvider: CoreProvider;

  private $uiProvider: UIProvider;

  constructor(
    public networkService: NetworkService,
    public $localizationService: LocalizationService
  ) {

    this.$serviceMessageList$ = new BehaviorSubject(new Array<CCUServicemessage>());
    this.$interfaceList$ = new BehaviorSubject(new Array<CCUInterface>());

    this.$deviceProvider = new DeviceProvider(this);
    this.$roomProvider = new RoomProvider(this);
    this.$functionProvider = new FunctionProvider(this);
    this.$programProvider = new ProgramProvider(this);
    this.$variableProvider = new VariableProvider(this.networkService);
    this.$uiProvider = new UIProvider(this);
    this.$coreProvider = new CoreProvider(this);

    // Refresh all providers after the connection change
    this.networkService.subscribeToConnectionStatus().subscribe(newConnection => {
      this.refresh();
      this.$deviceProvider.refresh();
      this.$roomProvider.refresh();
      this.$functionProvider.refresh();
      this.$programProvider.refresh();
      this.$variableProvider.refresh();
    })

    this.setupCurrentConnection();
  }

  setupCurrentConnection(): void {
    if (environment.production === true) {
      this.setConnection({
        protocol: window.location.protocol,
        hostname: window.location.hostname,
        name: window.location.hostname,
        port: 1234
      })

    } else {
      this.setConnection({
        protocol: 'https:',
        hostname: 'ccutest.thkl.arpa',
        name: window.location.hostname,
        port: 1234
      })

    }

  }

  refresh() {
    if (this.networkService.serverUrl !== undefined) {
      const key = 'config';
      this.networkService.getJsonData(key).then(result => {
        if ((result) && (result[key])) {
          const ccuKey = 'ccu';
          this.$ccuHost = result[key][ccuKey];
          this.cacheChanged.emit('CONFIG');
        }
      });

      if (this.socket) {
        this.socket.disconnect();
      }

      this.socket = new SocketOne(this.networkService.serverUrl)

      this.socket.on("connect", () => {
        console.log('connected'); // true
        this.socket.emit('Register Services')
      });

      this.socket.on("message", (arg) => {
        try {
          let payload = JSON.parse(arg);
          this.socketMessageHandler(payload);
        } catch (e) {

        }
      })

      this.updateServiceMessages();
      this.updateInterfaceList();
    }
  }

  get ccuHost(): string {
    return this.$ccuHost;
  }

  setConnection(newConnection: NetworkConnection): void {
    this.networkService.setConnection(newConnection);
  }

  get deviceProvider(): DeviceProvider {
    return this.$deviceProvider;
  }

  get roomProvider(): RoomProvider {
    return this.$roomProvider;
  }

  get functionProvider(): FunctionProvider {
    return this.$functionProvider;
  }

  get programProvider(): ProgramProvider {
    return this.$programProvider;
  }

  get variableProvider(): VariableProvider {
    return this.$variableProvider;
  }

  get onChangeObject(): EventEmitter<any> {
    return this.$onChangeObject;
  }

  get localizationService(): LocalizationService {
    return this.$localizationService;
  }

  get uiProvider(): UIProvider {
    return this.$uiProvider;
  }

  get coreProvider(): CoreProvider {
    return this.$coreProvider;
  }

  socketMessageHandler(payload) {
    let type = Object.keys(payload)[0]

    switch (type) {
      case 'service':
        this.$serviceMessageList = payload[type];
        this.$serviceMessageList$.next(this.$serviceMessageList);
        break;

      case 'system':
        switch (payload[type]) {
          case 'updaterooms':
            this.roomProvider.udpateRoomList();
            break;
          case 'updatedevices':
            this.deviceProvider.updateDeviceList();
            break;
          case 'updatefunctions':
            this.functionProvider.udpateFunctionList();
            break;
        }
        break;

      case 'device':
        // update a device
        this.deviceProvider.updateDeviceFromNetwork(payload[type]);
        break;
      case 'deviceStatus':
        this.deviceProvider.updateRSSI(payload[type]);
        break;
      case 'channel':
        // update a channel
        this.deviceProvider.updateChannelFromNetwork(payload[type]);
        break;

      case 'room':
        // update a room
        this.roomProvider.updateRoomFromNetwork(payload[type]);
        break;

      case 'function':
        this.functionProvider.updateFunctionFromNetwork(payload[type]);
        break;

      case 'variable':
        this.variableProvider.updateVariableFromNetwork(payload[type]);
        break;

      case 'event':
        const event: CCUEvent = payload[type];
        if (event) {
          const dp = this.deviceProvider.datapointWithName(event.address);
          if (dp) {
            dp.value = event.value;
            dp.lastChange = new Date();
          }
        }
        break;
      default:
        break;
    }
  }

  subscribeToNetworkStatus(): Observable<NetworkStatus> {
    return this.networkService.subscribeToNetworkStatus();
  }

  subscribeToInterfaceList(): Observable<CCUInterface[]> {
    return this.$interfaceList$.asObservable();
  }

  get interfaceList(): CCUInterface[] {
    return this.$interfaceList;
  }

  updateInterfaceList(): void {
    console.log('loading interfaces');
    this.networkService.getJsonData('interface')
      .then(result => {
        console.log('ALL Data: ', result);
        const key = 'interfaces';
        this.$interfaceList = result[key];
        this.$interfaceList$.next(this.$interfaceList);
      })
      .catch(error => {
        console.log('Error Getting Data: ', error);
      });
  }

  detailsForInterface(oInterface: CCUInterface): Promise<any> {
    return new Promise(resolve => {
      this.networkService.getJsonData('interface/' + oInterface.id).then(result => {
        const key = 'interface';
        resolve(result[key]);
      });
    });
  }


  updateServiceMessages(): void {
    const key = 'service';
    this.networkService.getJsonData(key).then(result => {
      console.log('ALL Data: ', result);
      if ((result) && (result[key])) {
        this.$serviceMessageList = result[key];
        this.$serviceMessageList$.next(this.$serviceMessageList);
      }
    });
  }

  get serviceMessages(): CCUServicemessage[] {
    return this.$serviceMessageList;
  }

  subscribeToServiceMessageList(): Observable<CCUServicemessage[]> {
    return this.$serviceMessageList$.asObservable();
  }

  saveObject(type: string, data: any): Promise<any[]> {
    return new Promise(async resolve => {
      switch (type) {
        case 'DEVICE':
          this.deviceProvider.saveDevice(data);
          break;
        case 'ROOM':
          this.roomProvider.saveRoom(data);
          break;
        case 'FUNCTION':
          this.functionProvider.saveFunction(data);
          break;
        case 'VARIABLE':
          this.variableProvider.saveVariable(data);
          break;
        default:
          console.log('missing handler for type %s', type)
          break;
      }
      resolve(null);
    });
  }
}
