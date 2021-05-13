import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { CCUFunction } from 'src/app/_interface/ccu/ccufunction';
import { CCUChannel } from 'src/app/_interface/ccu/channel';
import { CCURoom } from 'src/app/_interface/ccu/room';
import { DataService } from 'src/app/_service/data.service';
import { ModalService } from 'src/app/_service/modal_dialog_service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-deviceproperties',
  templateUrl: './deviceproperties.component.html',
  styleUrls: ['./deviceproperties.component.sass']
})
export class SideBarDevicepropertiesComponent implements OnInit {

  @Input() data: any;

  @Input() onSave: EventEmitter<object>;
  public addDialogTitle: string;
  public addDialogOK: string;
  public addDialogDescription: string;
  public addDialogPrefix: string;

  public newRoomName: string;
  public newFunctionName: string;

  public roomList: CCURoom[];
  public functionList: CCUFunction[];

  constructor(
    public dataService: DataService,
    private modalService: ModalService
  ) {
    this.roomList = this.dataService.roomProvider.roomList;
    this.dataService.roomProvider.subscribeToRoomList().subscribe(newRoomList => {
      this.roomList = newRoomList;
      this.updateChannelRoomFunctionList();
    });


    this.functionList = this.dataService.functionProvider.functionList;
    this.dataService.functionProvider.subscribeToFunctionList().subscribe(newFckList => {
      this.functionList = newFckList;
      this.updateChannelRoomFunctionList();
    });
  }

  ngOnInit(): void {
    // build the room List
    this.updateChannelRoomFunctionList();
    // will set the Ready Flag on next Save
    if (this.data.readyconfig === false) {
      this.data.setReady = true;
    }
  }

  updateChannelRoomFunctionList(): void {
    if (this.data !== undefined) {
      this.data.channels.forEach(channel => {
        channel.roomObjects = this.getRooms(channel);
        channel.functionObjects = this.getFunctions(channel);
      });
    }
  }

  getRooms(channel: CCUChannel): CCURoom[] {
    const result = [];
    this.roomList.forEach(room => {
      result.push({ id: room.id, name: room.name, selected: channel.rooms.indexOf(room.id) > -1 });
    });
    return result;
  }

  getFunctions(channel: CCUChannel): CCUFunction[] {
    const result = [];
    this.functionList.forEach(aFunction => {
      result.push({ id: aFunction.id, name: aFunction.name, selected: channel.functions.indexOf(aFunction.id) > -1 });
    });
    return result;
  }

  autoName(channel: CCUChannel): void {
    channel.name = `${this.data.name}:${channel.channelIndex}`;
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

  addNewFunction(): void {
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
