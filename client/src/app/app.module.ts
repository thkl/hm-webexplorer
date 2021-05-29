/*
 * **************************************************************
 * File: app.module.ts
 * Project: hm-webexplorer-client
 * File Created: Thursday, 11th March 2021 7:20:37 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:36:31 am
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

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { MenuComponent } from './_components/menu/menu.component';
import { CommonModule } from '@angular/common';
import { InterfaceComponent } from './_components/content/ccu/interface/interface.component';
import { SidebarModule } from 'ng-sidebar';
import { SidebarService } from './_service/uicomponent.service';
import { SidebarComponent } from './_components/sidebar/sidebar.component';
import { SideBarInterfaceComponent } from './_components/sidebar/interface/interface.component';
import { SideBarRoomComponent } from './_components/sidebar/room/room.component';
import { SideBarDeviceComponent } from './_components/sidebar/device/device.component';
import { SideBarVariableComponent } from './_components/sidebar/variable/variable.component';
import { DeviceComponent } from './_components/content/ccu/device/device.component';
import { ContainerComponent } from './_components/content/container/container.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomComponent } from './_components/content/ccu/room/room.component';
import { DataService } from './_service/data.service';
import { ServiceComponent } from './_components/content/ccu/service/service.component';
import { VariableComponent } from './_components/content/ccu/variable/variable.component';
import { PluralizePipe } from './_service/pluralizePipe';
import { CCUMessagesComponent } from './_components/sidebar/messages/messages.component';
import { SideBarDevicepropertiesComponent } from './_components/sidebar/device/deviceproperties/deviceproperties.component';
import { SideBarDevicesettingsComponent } from './_components/sidebar/device/devicesettings/devicesettings.component';
import { SideBarDeviceAutomationComponent } from './_components/sidebar/device/deviceautomation/deviceautomation.component';
import { ToDateObjPipe } from './_service/toDateObj';
import { SideBarRemovedeviceComponent } from './_components/sidebar/device/removedevice/removedevice.component';
import { LinkeditorComponent } from './_components/content/ccu/linkeditor/linkeditor.component';
import { MenuService } from './_service/menuservice';
import { CCUParameterLocalisationPipe } from './_service/localizationPipe';
import { EnterTimeHMSComponent, EnterPercentComponent, SubsetComponent } from './_components/content/ccu/linkeditor/uicomponents';
import { CCULinklistComponent } from './_components/content/ccu/linklist/linklist.component';
import { SocketOne } from './_service/socket';
import { CCUAutomationComponent } from './_components/content/ccu/automation/automation.component';

import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProgramlistComponent } from './_components/content/ccu/programlist/programlist.component';
import { ProgrameditorComponent } from './_components/content/ccu/programeditor/programeditor.component';
import {
  VariableConditionComponent, ChannelConditionComponent,
  SelectConditionObjectComponent, ConditionTriggerComponent,
  ConditionOperatorTypeComponent, ConditionTimerComponent
} from './_components/content/ccu/programeditor/uicomponents/uicomponents_condition';

import {
  DestinationSelectObjectComponent,
  DestinationChannelComponent,
  DestinationVariableComponent,
  DestinationScriptComponent,
  DestinationDelayComponent
} from './_components/content/ccu/programeditor/uicomponents/uicomponents_destination';
import { FunctionComponent } from './_components/content/ccu/function/function.component';
import { SideBarFunctionComponent } from './_components/sidebar/function/function.component';
import { ChannelchooserComponent } from './_components/content/channelchooser/channelchooser.component';
import { SideBarDeviceinfoComponent } from './_components/sidebar/device/deviceinfo/deviceinfo.component';

import { DialogConfirmComponent } from './_components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogMessageComponent } from './_components/dialogs/dialog-message/dialog-message.component';
import { DialogInputComponent } from './_components/dialogs/dialog-input/dialog-input.component';
import { ScripteditorComponent } from './_components/content/ccu/scripteditor/scripteditor.component';

import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { SyslogComponent } from './_components/content/ccu/syslog/syslog.component';
import { LoginComponent } from './_components/login/login.component';
import { MainComponent } from './_components/main/main.component';
import { HeaderComponent } from './_components/header/header.component';
import { AddonsComponent } from './_components/content/ccu/addons/addons.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    InterfaceComponent,
    SidebarComponent,
    DeviceComponent,
    ContainerComponent,
    SideBarInterfaceComponent,
    SideBarDeviceComponent,
    SideBarRoomComponent,
    SideBarVariableComponent,
    SideBarFunctionComponent,
    RoomComponent,
    FunctionComponent,
    ServiceComponent,
    VariableComponent,
    PluralizePipe,
    ToDateObjPipe,
    CCUParameterLocalisationPipe,
    CCUMessagesComponent,
    SideBarDevicepropertiesComponent,
    SideBarDevicesettingsComponent,
    SideBarDeviceAutomationComponent,
    SideBarRemovedeviceComponent,
    LinkeditorComponent,
    EnterTimeHMSComponent,
    EnterPercentComponent,
    SubsetComponent,
    CCUAutomationComponent,
    CCULinklistComponent,
    ProgramlistComponent,
    ProgrameditorComponent, VariableConditionComponent,
    ChannelConditionComponent, SelectConditionObjectComponent,
    ConditionTimerComponent,
    ConditionTriggerComponent,
    ConditionOperatorTypeComponent,
    DestinationSelectObjectComponent,
    DestinationChannelComponent,
    DestinationVariableComponent,
    DestinationScriptComponent,
    DestinationDelayComponent,
    ChannelchooserComponent,
    SideBarDeviceinfoComponent,
    DialogConfirmComponent,
    DialogMessageComponent,
    DialogInputComponent,
    ScripteditorComponent,
    SyslogComponent,
    LoginComponent,
    MainComponent,
    HeaderComponent,
    AddonsComponent
  ],
  entryComponents: [

  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    HttpClientModule,
    SidebarModule.forRoot(),
    NgbModule,
    CodemirrorModule
  ],
  providers: [SidebarService, MenuService, DataService, SocketOne, NgbActiveModal, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
