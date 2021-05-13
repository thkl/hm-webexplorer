/*
 * **************************************************************
 * File: room.component.ts
 * Project: hm-webexplorer-client
 * File Created: Saturday, 13th March 2021 6:55:17 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 10:02:35 am
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
 */
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



