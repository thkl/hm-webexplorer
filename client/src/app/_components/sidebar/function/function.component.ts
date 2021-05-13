/*
 * **************************************************************
 * File: function.component.ts
 * Project: hm-webexplorer-client
 * File Created: Saturday, 10th April 2021 4:01:43 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 10:02:58 am
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
import { CCUFunction } from 'src/app/_interface/ccu/ccufunction';
import { DataService } from 'src/app/_service/data.service';
import { ModalService } from 'src/app/_service/modal_dialog_service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.sass']
})
export class SideBarFunctionComponent implements OnInit {

  @Input() data: any;
  @Input() onSave: EventEmitter<object>;
  @Input() onDelete: EventEmitter<object>;

  public ccuFunction: CCUFunction;
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
    this.ccuFunction = JSON.parse(JSON.stringify(this.data)); // make a copy
    // localize the name
    this.channelsToAdd = [];
    this.channelsToRemove = [];

    this.ccuFunction.name = this.dataService.localizationService.parameterLocalization(this.ccuFunction.name, 'REGA');

    this.onSave.subscribe(() => {
      // Save the function Data
      this.data.name = this.ccuFunction.name;
      this.data.description = this.ccuFunction.description || '';
      // check if we have channels to change
      this.channelsToAdd.forEach(channelId => {
        this.dataService.deviceProvider.addFunctionToChannel(channelId, this.ccuFunction.id)
      })

      this.channelsToRemove.forEach(channelId => {
        this.dataService.deviceProvider.removeFunctionFromChannel(channelId, this.ccuFunction.id)
      })
    })

  }


  rebuidChannelObjects() {
    this.ccuFunction.channelObjects = [];
    this.ccuFunction.channels.forEach(channelID => {
      const chnl = this.dataService.deviceProvider.channelWithId(channelID);
      if (chnl) {
        this.ccuFunction.channelObjects.push(chnl);
      }
    });
  }

  removeChannel(channelid: number): void {
    this.channelsToRemove.push(channelid);
    this.ccuFunction.channels = this.ccuFunction.channels.filter(channel => {
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
          this.ccuFunction.channels.push(cid);
          this.rebuidChannelObjects();
        }
      })


  }

  deleteFunction(functionId: number) {

    this.modalService.confirm('Remove the Function ?', 'danger', 'Are u sure, that you want to remove this function ?').pipe(
      take(1) // take() manages unsubscription for us
    ).subscribe(result => {
      if (result === true) {
        this.dataService.functionProvider.removeFunction(functionId).then(() => {
          console.log('Function removed')
          this.onDelete.emit(null);
        });
      }
    });

  }


  trackChannels(index: number, element: any) {
    return element ? element.id : null
  }

}
