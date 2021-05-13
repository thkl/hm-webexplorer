import { Component, OnInit, Input } from '@angular/core';
import { NetworkService } from 'src/app/_service/network.service';
import { CCUDevice } from 'src/app/_interface/ccu/device';
import { SidebarService } from 'src/app/_service/uicomponent.service';
import { DataService } from 'src/app/_service/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CCUInterface } from 'src/app/_interface/ccu/interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.sass']
})
export class DeviceComponent implements OnInit {


  public imgHost: string;
  private pollingIntervall;
  public isActive = false;
  private interfaceList: CCUInterface[];
  public selectedInterface: CCUInterface;

  private teachInTimer;
  public currentTeachInProcess: number;

  public deviceList: CCUDevice[]; // this is the filtered list which will be displayd
  public newDeviceList: CCUDevice[];
  public awailableInterfaces: Observable<CCUInterface[]>;

  constructor(
    public networkService: NetworkService,
    public sidebarService: SidebarService,
    public dataService: DataService,

    private modalService: NgbModal
  ) {
    this.imgHost = networkService.apiHost;
  }

  public _toggleSidebar(deviceid: number): void {
    const device = this.dataService.deviceProvider.deviceWithId(deviceid);
    console.log(device);
    this.sidebarService.openSideBar('DEVICE', 'Device: ' + device.name, device, true);
  }

  public removeFilter(): void {
    this.deviceList = this.dataService.deviceProvider.deviceList;
  }

  public setFilter(event: any): void {
    const fltr = event.target.value;
    this.deviceList = this.dataService.deviceProvider.deviceList.filter((device => {
      return device.name.toLowerCase().indexOf(fltr.toLowerCase()) > -1;
    }));
  }

  public _openTeachInDialog(content): void {
    this.modalService.open(content, { size: 'lg' });
  }

  public teachInDevice(): void {
    this.isActive = true;
    this.currentTeachInProcess = 0;
    this.teachInTimer = setInterval(() => {
      this.currentTeachInProcess = this.currentTeachInProcess + 1.66;
    }, 1000);
    this.dataService.deviceProvider.teachInDevice(this.selectedInterface.id).then(() => {
      this.isActive = false;
      clearInterval(this.teachInTimer);
    });
  }

  public stopInstall(): void {
    if ((this.selectedInterface) && (this.isActive === true)) {
      this.dataService.deviceProvider.cancelTeachIn(this.selectedInterface.id).then(() => {
        this.isActive = false;
        clearInterval(this.teachInTimer);
      });
    }
  }

  public selectTeachInInterface(selectedInterface: CCUInterface): void {
    this.selectedInterface = selectedInterface;
  }

  private showDeviceList(): void {
    this.deviceList = this.dataService.deviceProvider.deviceList;
  }

  public refreshDeviceList(): void {
    this.dataService.deviceProvider.updateDeviceList();
  }

  ngOnInit(): void {
    this.showDeviceList();
    this.dataService.deviceProvider.subscribeToDeviceList().subscribe((newDeviceList: CCUDevice[]) => {
      this.deviceList = newDeviceList;
      this.newDeviceList = newDeviceList.filter(device => {
        return (device.readyconfig === false);
      });
      console.log('device list changed');
    });

    this.interfaceList = this.dataService.interfaceList;

    this.dataService.subscribeToInterfaceList().subscribe((newList) => {
      this.interfaceList = newList;
    });



    this.awailableInterfaces = new Observable((observer) => {
      const list = [];
      const pList = [];
      this.interfaceList.forEach((oInterface) => {
        pList.push(new Promise(async (resolve) => {
          const details = await this.dataService.detailsForInterface(oInterface);
          if ((details) && (details.methods) && (details.methods.indexOf('addDevice') > -1)) {
            list.push(oInterface);
            observer.next(list);
            resolve(null);
          }
        }));
      });
      Promise.all(pList).then(() => {
        observer.complete();
      });
    });
  }

  sortTable(item: string): void {
    this.deviceList = this.dataService.deviceProvider.deviceList.sort((a, b) => {
      switch (item) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'interfaceName':
          if ((a.interfaceName) && (b.interfaceName)) {
            return a.interfaceName.localeCompare(b.interfaceName);
          } else {
            return 0;
          }
        case 'serial':
          return a.serial.localeCompare(b.serial);
        case 'type':
          return a.type.localeCompare(b.type);

        default:
          break;
      }
    });
  }

}

