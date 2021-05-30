import { Component, OnInit, Input } from '@angular/core';
import { NetworkService } from 'src/app/_service/network.service';
import { CCURoom } from 'src/app/_interface/ccu/room';
import { SidebarService } from 'src/app/_service/uicomponent.service';
import { DataService } from 'src/app/_service/data.service';
import { CCUChannel } from 'src/app/_interface/ccu/channel';
import { ModalService } from 'src/app/_service/modal_dialog_service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html'
})
export class RoomComponent implements OnInit {

  @Input() roomList: CCURoom[]; // this is the filtered list which will be displayd

  public apihost: string;
  public newRoomName: string;

  constructor(
    public networkService: NetworkService,
    public sidebarService: SidebarService,
    public dataService: DataService,
    private modalService: ModalService
  ) {
    this.apihost = networkService.apiHost;
  }

  public _toggleSidebar(room: CCURoom): void {
    this.sidebarService.openSideBar('ROOM', 'Room: ' + this.dataService.localizationService.parameterLocalization(room.name, 'REGA'), room, true);
  }

  public _showChannel(channelid: number): void {
    const channel = this.dataService.deviceProvider.channelWithId(channelid);
    const device = this.dataService.deviceProvider.deviceWithChannelId(channel.id);
    this.sidebarService.openSideBar('DEVICE', 'Device: ' + device.name, device, true);
  }

  ngOnInit(): void {
    this.dataService.roomProvider.updateChannels();
    this.roomList = this.dataService.roomProvider.roomList;
    this.dataService.roomProvider.subscribeToRoomList().subscribe(newRoomList => {
      this.roomList = newRoomList;
    });

    this.dataService.uiProvider.searchCallback = (fltr) => {
      this.roomList = this.dataService.roomProvider.roomList.filter((room => {
        if (room.name.toLowerCase().indexOf(fltr.toLowerCase()) > -1) {
          return true;
        }
        let rslt = false;
        room.channelObjects.forEach(channel => {
          if (channel.name.toLowerCase().indexOf(fltr.toLowerCase()) > -1) {
            rslt = true;
          }
        })
        return rslt;
      }));
    }

  }

  trackbyRoom(ccuRoom: { id: any; }): any {
    return ccuRoom.id;
  }

  trackByChannel(ccuChannel: { id: any; }): any {
    return ccuChannel.id;
  }

  addNewRoom(): void {
    this.modalService.input('New Room', 'info', 'Please name the new room.', '').pipe(
      take(1) // take() manages unsubscription for us
    ).subscribe(result => {
      if (result) {
        console.log({ inputResult: result });
        this.dataService.roomProvider.createRoom(result);
      }
    });
  }
}
