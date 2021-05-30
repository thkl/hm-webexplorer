import { Component, Input, OnInit } from '@angular/core';
import { CCUFunction } from 'src/app/_interface/ccu/ccufunction';
import { CCUChannel } from 'src/app/_interface/ccu/channel';
import { DataService } from 'src/app/_service/data.service';
import { ModalService } from 'src/app/_service/modal_dialog_service';
import { NetworkService } from 'src/app/_service/network.service';
import { SidebarService } from 'src/app/_service/uicomponent.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.sass']
})
export class FunctionComponent implements OnInit {


  @Input() functionList: CCUFunction[]; // this is the filtered list which will be displayd

  public apihost: string;
  public newFunctionName: string;

  constructor(
    public networkService: NetworkService,
    public sidebarService: SidebarService,
    public dataService: DataService,
    private modalService: ModalService
  ) { this.apihost = networkService.apiHost; }

  ngOnInit(): void {
    this.dataService.functionProvider.updateChannels();
    this.functionList = this.dataService.functionProvider.functionList;
    this.dataService.functionProvider.subscribeToFunctionList().subscribe(newFunctionList => {
      this.functionList = newFunctionList;
    });

    this.dataService.uiProvider.searchCallback = (fltr) => {
      this.functionList = this.dataService.functionProvider.functionList.filter((fcktion => {
        if (fcktion.name.toLowerCase().indexOf(fltr.toLowerCase()) > -1) {
          return true;
        }
        let rslt = false;
        fcktion.channelObjects.forEach(channel => {
          if (channel.name.toLowerCase().indexOf(fltr.toLowerCase()) > -1) {
            rslt = true;
          }
        })
        return rslt;
      }));
    }
  }

  public _toggleSidebar(ccuFunction: CCUFunction): void {
    this.sidebarService.openSideBar('FUNCTION', 'Function: ' + this.dataService.localizationService.parameterLocalization(ccuFunction.name, 'REGA'), ccuFunction, true);
  }

  public _showChannel(channelid: number): void {
    const channel = this.dataService.deviceProvider.channelWithId(channelid);
    const device = this.dataService.deviceProvider.deviceWithChannelId(channel.id);
    this.sidebarService.openSideBar('DEVICE', 'Device: ' + device.name, device, true);
  }


  public getChannels(ccuFunction: CCUFunction): CCUChannel[] {
    const result = [];
    ccuFunction.channels.forEach(channelID => {
      const chnl = this.dataService.deviceProvider.channelWithId(channelID);
      result.push(chnl);
    });
    return result;
  }


  trackbyFunction(ccuRoom: { id: any; }): any {
    return ccuRoom.id;
  }

  trackByChannel(ccuChannel: { id: any; }): any {
    return ccuChannel.id;
  }

  newFunction() {
    this.modalService.input('New Function', 'info', 'Please name the new function.', '').pipe(
      take(1) // take() manages unsubscription for us
    ).subscribe(result => {
      if (result) {
        console.log({ inputResult: result });
        this.dataService.functionProvider.createFunction(result);
      }
    });
  }

}
