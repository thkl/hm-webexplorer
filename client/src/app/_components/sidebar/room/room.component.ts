import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { CCURoom } from 'src/app/_interface/ccu/room';
import { DataService } from 'src/app/_service/data.service';
import { ModalService } from 'src/app/_service/modal_dialog_service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html'
})
export class SideBarRoomComponent implements OnInit {

  @Input() data: any;
  @Input() onSave: EventEmitter<object>;
  @Input() onDelete: EventEmitter<object>;

  public ccuRoom: CCURoom;
  public apihost: string;
  private channelsToAdd: number[];
  private channelsToRemove: number[];

  constructor(
    private dataService: DataService,
    private modalService: ModalService
  ) {
    this.apihost = this.dataService.networkService.apiHost;
  }

  ngOnInit(): void {
    this.ccuRoom = JSON.parse(JSON.stringify(this.data)); // make a copy
    this.channelsToAdd = [];
    this.channelsToRemove = [];
    // localize the name
    this.ccuRoom.name = this.dataService.localizationService.parameterLocalization(this.ccuRoom.name, 'REGA');
    this.onSave.subscribe(() => {
      // Save the room Data
      this.data.name = this.ccuRoom.name;
      this.data.description = this.ccuRoom.description || '';

      // check if we have channels to change
      this.channelsToAdd.forEach(channelId => {
        this.dataService.deviceProvider.addRoomToChannel(channelId, this.ccuRoom.id)
      })

      this.channelsToRemove.forEach(channelId => {
        this.dataService.deviceProvider.removeRoomFromChannel(channelId, this.ccuRoom.id)
      })
    })
  }

  rebuidChannelObjects() {
    this.ccuRoom.channelObjects = [];
    this.ccuRoom.channels.forEach(channelID => {
      const chnl = this.dataService.deviceProvider.channelWithId(channelID);
      if (chnl) {
        this.ccuRoom.channelObjects.push(chnl);
      }
    });
  }

  removeChannel(channelid: number): void {
    this.channelsToRemove.push(channelid);
    this.ccuRoom.channels = this.ccuRoom.channels.filter(channel => {
      return channel !== channelid;
    })
    this.rebuidChannelObjects();
  }

  openChannelChooser(content) {
    const modalRef = this.modalService.custom(content, { size: 'lg', backdrop: true, windowClass: 'frontMost modal-info' })
      .pipe(
        take(1) // take() manages unsubscription for us
      ).subscribe(result => {
        if (result) {
          let cid = result['id'];
          this.channelsToAdd.push(cid);
          this.ccuRoom.channels.push(cid);
          this.rebuidChannelObjects();
        }
      })
  }

  deleteRoom(roomId: number): void {

    this.modalService.confirm('Remove the Room ?', 'danger', 'Are u sure, that you want to remove this room ?').pipe(
      take(1) // take() manages unsubscription for us
    ).subscribe(result => {
      if (result === true) {
        this.dataService.roomProvider.removeRoom(roomId).then(() => {
          console.log('Room removed')
          this.onDelete.emit(null);
        });
      }
    });

  }

  trackChannels(index: number, element: any) {
    return element ? element.id : null
  }

}



