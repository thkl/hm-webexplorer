/*
 * **************************************************************
 * File: device.component.ts
 * Project: hm-webexplorer-client
 * File Created: Friday, 12th March 2021 6:16:33 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 10:03:06 am
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
import { Component, AfterViewInit, Input, EventEmitter, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { SideBar } from 'src/app/_interface/Sidebar';
import { SidebarItem } from 'src/app/_interface/SideBarItem';
import { DataService } from 'src/app/_service/data.service';
import { SideBarDeviceAutomationComponent } from './deviceautomation/deviceautomation.component';
import { SideBarDeviceinfoComponent } from './deviceinfo/deviceinfo.component';
import { SideBarDevicepropertiesComponent } from './deviceproperties/deviceproperties.component';
import { SideBarDevicesettingsComponent } from './devicesettings/devicesettings.component';
import { SideBarRemovedeviceComponent } from './removedevice/removedevice.component';

@Component({
  selector: 'app-interface',
  templateUrl: './device.component.html'
})
export class SideBarDeviceComponent implements AfterViewInit {

  @Input() data: any;
  private deviceData: any;
  private sideBarItem: SidebarItem;
  public selectedComponent: string;
  @ViewChild('sidebarDeviceHost', { read: ViewContainerRef }) public sidebarDeviceHost: ViewContainerRef;

  @Input() onSave: EventEmitter<object>;
  @Input() onDelete: EventEmitter<object>;

  constructor(
    public dataService: DataService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }


  getComponent(type: any): SidebarItem {
    this.selectedComponent = type;
    // we have to use the copy
    switch (type) {
      case 'PROPERTIES':
        return new SidebarItem(SideBarDevicepropertiesComponent, this.deviceData, new EventEmitter());
      case 'SETTINGS':
        return new SidebarItem(SideBarDevicesettingsComponent, this.deviceData, new EventEmitter());
      case 'AUTOMATION':
        return new SidebarItem(SideBarDeviceAutomationComponent, this.deviceData, new EventEmitter());
      case 'DELETE':
        return new SidebarItem(SideBarRemovedeviceComponent, this.deviceData, new EventEmitter(), this.onDelete);
      case 'TECHINFO':
        return new SidebarItem(SideBarDeviceinfoComponent, this.deviceData, new EventEmitter());
      default:
        break;
    }
  }


  loadComponent(type: string): void {
    this.sideBarItem = this.getComponent(type); // this components will just exist in device sidebars
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.sideBarItem.component);

    const viewContainerRef = this.sidebarDeviceHost;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<SideBar>(componentFactory);
    componentRef.instance.data = this.sideBarItem.data;
    componentRef.instance.onSave = this.sideBarItem.onSave;
    componentRef.instance.onDelete = this.sideBarItem.onDelete;
  }


  ngAfterViewInit(): void {
    this.deviceData = JSON.parse(JSON.stringify(this.data)); // make a copy

    this.onSave.subscribe(() => {
      // copy back the attributes
      this.data.selectedComponent = this.selectedComponent;
      this.data.name = this.deviceData.name;
      this.data.setReady = this.deviceData.setReady;

      this.deviceData.channels.forEach(channel => {
        // remove unused rooms
        channel.rooms = [];
        channel.roomObjects.filter((room) => {
          if (room.selected === true) {
            channel.rooms.push(room.id);
          }
        });
        // remove unused functions
        channel.functions = [];
        channel.functions = channel.functionObjects.forEach(fck => {
          if (fck.selected === true) {
            channel.functions.push(fck.id);
          }
        });

        this.data.channels = this.deviceData.channels;

        // Copy the Paramsets back if changed
        if (this.deviceData.paramsetIsDirty === true) {
          this.data.paramsets = this.deviceData.paramsets;
        }
      });
    });
    this.loadComponent('PROPERTIES');
  }
}
