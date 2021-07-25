import { Injectable } from '@angular/core';
import { Application } from '../interface/application';
import { BehaviorSubject, Observable } from 'rxjs';
import { NetworkService } from './network.service';
import { CCUEvent } from '../interface/CCUEvent';
import { Blind } from '../implementation/device/BlindDevice';
import { _Item, Item } from '../interface/item';
import { _Page, Page } from '../interface/page';
import { Key } from '../implementation/device/KeyDevice';
import { RGBDevice } from '../implementation/device/RgbDevice';
import { Program } from '../implementation/program';
import { SwitchDevice } from '../implementation/device/SwitchDevice';
import { DimmerDevice } from '../implementation/device/DimmerDevice';
import { TemperatureSensor } from '../implementation/device/TempsensorDevice';
import { SonosDevice } from '../implementation/device/SonosDevice';
import { ContactDevice } from '../implementation/device/ContactDevice';
import { RotaryDevice } from '../implementation/device/RotaryDevice';
import { GenericDevice } from '../implementation/Generic';
import { ContactGroupDevice } from '../implementation/device/ContactGroup';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private $application: Application;
  private $application$: BehaviorSubject<Application>;
  private $ccuDeviceList: any;
  private minimizeTimer: any;

  constructor(
    private networkService: NetworkService
  ) {
    const dashBoardID = window.location.search.replace('?', ''); //?test -> dashboard name is test

    this.$application$ = new BehaviorSubject(new Application(networkService));
    console.log('Getting Dashboard Contents')
    this.networkService.getJsonData(`config/dashboard/${dashBoardID}`).then(appData => {
      this.networkService.getJsonData('device/').then(deviceList => {
        this.$ccuDeviceList = deviceList.devices;
        console.log('content data found')
        this.buildDeviceList(appData);
        this.switchPage(undefined)

      });

    })


    this.networkService.subscribeToCCUEvents().subscribe((newEvent: CCUEvent) => {
      let serial = undefined;
      // get address
      let rgx = /([a-zA-Z0-9-]{1,}).([a-zA-Z0-9-_]{1,}):([0-9]{1,}).([a-zA-Z0-9-_]{1,})/g
      let parts = rgx.exec(newEvent.address)
      if ((parts) && (parts.length > 4)) {
        serial = parts[2]
      }

      if (serial) {
        let device = this.deviceWithAddress(serial);
        if (device !== undefined) {
          device.updateDatapoint(newEvent.address, newEvent.ts, newEvent.value);
        }
      } else {
        console.error('Nothing found for %s', newEvent.address)
      }

    })
  }

  getCCUDeviceWithAddress(address: string) {
    let d = this.$ccuDeviceList.filter((ccudevice: { address: string; }) => {
      return (ccudevice.address === address);
    })
    if (d.length > 0) {
      return d[0];
    } else {
      console.log('Not Device found for %s', address);
    }
    return undefined;
  }

  createDevice(interfaceName: string, address: string, type: string): any {

    let result;
    switch (type) {

      case 'switch':
      case 'HM-LC-Sw1-FM':
        result = new SwitchDevice(interfaceName, address, this.networkService);
        break

      case 'dimmer':
        result = new DimmerDevice(interfaceName, address, this.networkService);
        break

      case 'temp':
      case 'HM-WDS10-TH-O':
      case 'HM-TC-IT-WM-W-EU':
        result = new TemperatureSensor(interfaceName, address, this.networkService);
        break

      case 'sonos':
        result = new SonosDevice(interfaceName, address, this.networkService);
        break

      case 'blind':
      case 'HM-LC-Bl1PBU-FM':
        result = new Blind(interfaceName, address, this.networkService);
        break;

      case 'key':
        result = new Key(interfaceName, address, this.networkService);
        break;

      case 'rgb':
      case 'VIR-LG-RGB-DIM':
        result = new RGBDevice(interfaceName, address, this.networkService);
        break;

      case 'contact':
      case 'HM-Sec-SCo':
      case 'HM-Sec-SC':

        result = new ContactDevice(interfaceName, address, this.networkService);
        break;

      case 'program':
        result = new Program(interfaceName, address, this.networkService);
        break;

      case 'rotary':
      case 'HM-Sec-RHS':
        result = new RotaryDevice(interfaceName, address, this.networkService);
        break;

      case 'contactgroup':
        result = new ContactGroupDevice(interfaceName, address, this.networkService);
        break;

      default:
        console.log('%s CCU Type %s', address, type)
        result = new GenericDevice(interfaceName, address, this.networkService);
    }

    return result;

  }

  _addSingleDeviceIfNotHere(interfaceName: string, address: string, type: string): GenericDevice {
    let device = this.deviceWithAddress(address);
    if (device === undefined) {
      console.log('Adding new Device with address (%s) %s and type %s', interfaceName, address, type);
      device = this.createDevice(interfaceName, address, type);
      this.$application.deviceList.push(device);
    }
    return device;
  }

  addDeviceIfNotHere(item: Item): void {
    const address = item.device;
    const type = item.type;

    if (typeof address === 'string') {
      const ccuDevice = this.getCCUDeviceWithAddress(address);
      if ((ccuDevice) && (item.deviceType === undefined)) {
        this._addSingleDeviceIfNotHere(ccuDevice.interfaceName, address, ccuDevice.type);
      } else {
        let idt = item.deviceType;
        let ifName = '';
        if ((ccuDevice) && (ccuDevice.interfaceName)) {
          ifName = ccuDevice.interfaceName
        }
        this._addSingleDeviceIfNotHere(ifName, address, idt || '');
      }
    }

    if ((typeof address === 'object') && (type === 'contactgroup')) {
      let device = this._addSingleDeviceIfNotHere('', item.id, type) as ContactGroupDevice;
      address.forEach((element: string) => {
        const ccuDevice = this.getCCUDeviceWithAddress(element);
        let sDevice = this._addSingleDeviceIfNotHere(ccuDevice.interfaceName, element, ccuDevice.type);
        device.addDevice(sDevice as ContactDevice);
      });
    }

  }

  buildDeviceList(data: any): void {
    this.$application = new Application(this.networkService);
    console.log('Creating Weather')
    if (data.weather) {
      if (data.weather) {
        this.$application.weather.setVariables(data.weather);
      }
    }

    console.log('Creating Header')
    data.header.forEach((headerItem: _Item) => {
      let item = new Item(headerItem);
      this.$application.header.push(item);
      this.addDeviceIfNotHere(item);
    })

    console.log('creating pages')
    data.pages.forEach((page: _Page) => {
      if (page.items !== undefined) {
        let tmpPage = new Page(page);
        page.items.forEach((pageItem: _Item) => {
          let item = new Item(pageItem);
          tmpPage.addItem(item);
          this.addDeviceIfNotHere(item);
        });
        this.$application.pages.push(tmpPage);
      }
    })

  }

  deviceWithAddress(address: string): any {
    let d = this.$application.deviceList.filter(device => {
      return (device.address === address);
    })
    return (d.length > 0) ? d[0] : undefined;
  }

  initApplication(): Observable<Application> {
    return this.$application$.asObservable();
  }

  getApplication(): Application {
    return this.$application;
  }

  switchPage(pageId?: string) {
    if (this.$application) {
      console.log('switching page %s', pageId);
      this.$application.pages.forEach(page => {
        if ((page.id === pageId) || ((pageId === undefined) && (page.isRoot === true))) {
          page.isActive = true;
          this.$application.currentPage = page;
          this.maximize('', false);
        } else {
          page.isActive = false;
        }
      })
      this.$application$.next(this.$application);
    }
  }

  maximize(id: string, isMaximized: boolean): void {
    console.log('Maximizing %s %s', id, isMaximized)
    this.$application.currentPage?.items?.forEach(item => {
      if (isMaximized === false) {
        if (item.visualStateID !== Item.visualStateNormal) {
          item.visualStateID = Item.visualStateNormal;
        }

      } else {
        if (id === item.id) {
          if (isMaximized === true) {
            console.log('Setup %s is currently %s', id, item.visualStateID)
            if (item.visualStateID !== Item.visualStateMaximized) {
              console.log('setnewState %s', Item.visualStateMaximized)
              item.visualStateID = Item.visualStateMaximized;
            }
            clearTimeout(this.minimizeTimer);
            this.minimizeTimer = setTimeout(() => {
              this.maximize('', false);
            }, 20000)
          }
        } else {
          if (item.visualStateID !== Item.visualStateMinimized) {
            item.visualStateID = Item.visualStateMinimized;
          }
        }
      }
    })
  }

  getDeviceState(device: GenericDevice, dataPoint: string): Promise<any> {
    console.log('get %s from %s', dataPoint, device.address)
    return new Promise(resolve => {
      this.networkService.getJsonData(`state/${device.address}`).then(state => {
        if (state) {
          state.forEach((element: { name: string; ts: any; state: any; }) => {
            if (element.name === dataPoint) {
              resolve(element.state)
              return
            }
          });
        } else {
          resolve(-1);
        }
      })
    })
  }

}
