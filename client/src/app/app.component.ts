/*
 * **************************************************************
 * File: app.component.ts
 * Project: hm-webexplorer-client
 * File Created: Thursday, 11th March 2021 7:20:37 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:36:41 am
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
import { Component } from '@angular/core';
import { DataService } from './_service/data.service';
import { LocalizationService } from './_service/localization_service';
import { SidebarService } from './_service/uicomponent.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'HomeMatic Web Explorer';

  public footerMessage: string;

  constructor(
    public sideBarService: SidebarService,
    public dataService: DataService,
    public localizationService: LocalizationService
  ) {

    console.log('Launching ...');
    let userLang = navigator.language;
    userLang = userLang.split('-')[1].toLocaleLowerCase();

    this.localizationService.loadValues(userLang);

    this.dataService.onInterfaceMessage.subscribe((message) => {
      this.footerMessage = message;
      setTimeout(() => { this.footerMessage = ''; }, 20000);
    });
  }

  closeSidebar(): void {
    this.sideBarService.closeSideBar();
  }
}
