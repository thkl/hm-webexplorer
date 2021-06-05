import { Component, OnInit } from '@angular/core';
import { CCUDevice } from 'src/app/_interface/ccu/device';
import { CCUServicemessage } from 'src/app/_interface/ccu/servicemessage';
import { DataService, SystemStatus } from 'src/app/_service/data.service';
import { MenuService } from 'src/app/_service/menuservice';
import { SidebarService } from 'src/app/_service/uicomponent.service';

class StateMessage {
  message: string;
  class: string;
}


@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.sass']
})

export class ServiceComponent implements OnInit {

  public ccuHost: string;
  public deviceCount: number;
  public roomCount: number;
  public variableCount: number;
  public programCount: number;
  public systemStatus: SystemStatus;
  public currentState: StateMessage;

  private lastState: StateMessage;

  constructor(
    public sidebarService: SidebarService,
    public dataService: DataService,
    private menuItemservice: MenuService
  ) {
  }


  public _toggleSidebar(device): void {
    this.sidebarService.openSideBar('SERVICEMESSAGES', 'Servicemessages', { type: 'SERVICE' }, false);
  }

  public jumpTo(item: string): void {
    if (item === 'programs') {
      this.menuItemservice.selectMenuItem('automation', { selectedTab: 'program' });
    } else {
      this.menuItemservice.selectMenuItem(item);
    }
  }

  updateServiceMessages(msgList: CCUServicemessage[]): void {
    if ((msgList) && (msgList.length > 0)) {
      this.lastState = this.currentState;
      this.currentState = {
        message: (msgList.length === 1) ? 'Heads up, there is one issue ...' : `Heads up, there are ${msgList.length} service issues.`,
        class: 'bg-warning'
      };
    }
    else {
      this.lastState = this.currentState;
      this.currentState = {
        message: 'Everything is fine',
        class: 'bg-success'
      };
    }
  }

  ngOnInit(): void {
    console.log('Init Service Message Component');

    this.dataService.deviceProvider.subscribeToDeviceList().subscribe((newDeviceList: CCUDevice[]) => {
      this.deviceCount = newDeviceList.length;
    });

    this.deviceCount = this.dataService.deviceProvider.deviceList.length;

    this.dataService.roomProvider.subscribeToRoomList().subscribe(newRoomList => {
      this.roomCount = newRoomList.length;
    });

    this.roomCount = this.dataService.roomProvider.roomList.length;

    this.dataService.variableProvider.subscribeToVariableList().subscribe(variableList => {
      this.variableCount = variableList.length;
    });

    this.variableCount = this.dataService.variableProvider.variableList.length;

    this.updateServiceMessages(this.dataService.serviceMessages);

    this.dataService.subscribeToServiceMessageList().subscribe((newList) => {
      this.updateServiceMessages(newList);
    });

    this.dataService.subscribeTosystemStatus().subscribe((newStatus) => {
      if (newStatus.times) {
        this.systemStatus = newStatus;
      }
    });

    this.dataService.subscribeToNetworkStatus().subscribe(newStatus => {
      if (newStatus.serverIsReachable === false) {

        this.currentState = {
          message: 'Network issue. Unable to connect to API',
          class: 'bg-danger'
        };

      } else {
        this.currentState = this.lastState;
      }
    })


    this.dataService.programProvider.subscribeToProgramList().subscribe(programList => {
      this.programCount = programList.length;
    });

    this.programCount = this.dataService.programProvider.programList.length;



    this.dataService.cacheChanged.subscribe(obj => {
      if (obj === 'CONFIG') {
        this.ccuHost = this.dataService.networkService.getCurrentConnectionName();
      }
    });
  }

}
