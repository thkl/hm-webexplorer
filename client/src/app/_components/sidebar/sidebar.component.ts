import { Component, ComponentFactoryResolver, OnInit, Input, ViewChild, ViewContainerRef, EventEmitter } from '@angular/core';
import { SidebarService } from '../../_service/uicomponent.service';
import { SideBar } from '../../_interface/Sidebar';
import { SidebarItem } from 'src/app/_interface/SideBarItem';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})

/*
 * **************************************************************
 * File: sidebar.component.ts
 * Project: hm-webexplorer-client
 * File Created: Friday, 12th March 2021 2:49:22 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 10:02:20 am
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
export class SidebarComponent implements OnInit, SideBar {
  @Input() data: any;
  @Input() title: string;
  @Input() isEditable: boolean;
  @Input() onSave: EventEmitter<object>;
  @Input() onDelete: EventEmitter<object>;

  @ViewChild('sidebarHost', { read: ViewContainerRef }) public sidebarHost: ViewContainerRef;

  private sideBarItem: SidebarItem;
  private objectType: string;

  constructor(
    public sideBarService: SidebarService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }


  ngOnInit(): void {
    this.sideBarService.sideBarChanged.subscribe(data => {
      this.title = data.title;
      this.isEditable = data.isEditable;
      this.objectType = data.type;
      this.loadComponent(data.apiHost, data.type);
    });
  }

  sidebar_close(): void {
    this.sideBarService.closeSideBar();
  }

  saveData(): void {
    console.log('save');
    this.sideBarItem.onSave.emit();
    this.sideBarService.saveObject(this.objectType, this.sideBarItem.data).then(() => {
      console.log('closing sidebar')
      this.sidebar_close();
    });
  }

  loadComponent(apiHost: string, type: string): void {
    this.sideBarItem = this.sideBarService.getComponent(type);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.sideBarItem.component);

    const viewContainerRef = this.sidebarHost;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<SideBar>(componentFactory);
    componentRef.instance.data = this.sideBarItem.data;
    componentRef.instance.onSave = this.sideBarItem.onSave;
    componentRef.instance.onDelete = this.sideBarItem.onDelete;
  }


}
