/*
 * **************************************************************
 * File: uicomponent.service.ts
 * Project: hm-webexplorer-client
 * File Created: Friday, 12th March 2021 2:20:29 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:37:19 am
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

import { Injectable, EventEmitter } from '@angular/core';
import { SideBarDeviceComponent } from '../_components/sidebar/device/device.component';
import { SideBarInterfaceComponent } from '../_components/sidebar/interface/interface.component';

import { SidebarItem } from '../_interface/SideBarItem';
import { NetworkService } from 'src/app/_service/network.service';
import { SideBarRoomComponent } from '../_components/sidebar/room/room.component';
import { SideBarVariableComponent } from '../_components/sidebar/variable/variable.component';
import { CCUMessagesComponent } from '../_components/sidebar/messages/messages.component';
import { DataService } from './data.service';
import { SideBarFunctionComponent } from '../_components/sidebar/function/function.component';

export class SideBarEventObject {
  title: string;
  isEditable: boolean;
  type: string;
  apiHost: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  public $opened = false;
  private $componentData: any;

  public sideBarChanged = new EventEmitter<SideBarEventObject>();
  public sideBarShouldClose = new EventEmitter<object>();

  constructor(
    public networkService: NetworkService,
    public dataService: DataService
  ) { }

  openSideBar(type: string, title: string, data: any, isEditable: boolean): void {
    if (this.$opened === false) {
      this.$componentData = data;
      this.$componentData.apiHost = this.networkService.apiHost;
      this.sideBarChanged.emit({ title, data, type, isEditable, apiHost: '' });
    }
    this.$opened = !this.$opened;
  }

  get isOpen(): boolean {
    return this.$opened;
  }

  set isOpen(isOpen: boolean) {
    this.$opened = isOpen;
  }

  saveObject(type: string, data: any): Promise<any[]> {
    return this.dataService.saveObject(type, data);
  }

  closeSideBar(): void {
    this.$opened = false;
  }

  getComponent(type: any): SidebarItem {

    const closeEmitter = new EventEmitter();
    closeEmitter.subscribe(() => {
      this.closeSideBar();
    });


    switch (type) {
      case 'INTERFACE':
        return new SidebarItem(SideBarInterfaceComponent, this.$componentData, new EventEmitter());
      case 'DEVICE':
        console.log('DEVICE');

        return new SidebarItem(SideBarDeviceComponent, this.$componentData, new EventEmitter(), closeEmitter);
      case 'ROOM':
        return new SidebarItem(SideBarRoomComponent, this.$componentData, new EventEmitter(), closeEmitter);
      case 'FUNCTION':
        return new SidebarItem(SideBarFunctionComponent, this.$componentData, new EventEmitter(), closeEmitter);
      case 'VARIABLE':
        return new SidebarItem(SideBarVariableComponent, this.$componentData, new EventEmitter(), closeEmitter);
      case 'SERVICEMESSAGES':
        return new SidebarItem(CCUMessagesComponent, this.$componentData, new EventEmitter());

      default:
        break;
    }
  }

}


