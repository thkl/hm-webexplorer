/*
 * **************************************************************
 * File: main.component.ts
 * Project: hm-webexplorer-client
 * File Created: Monday, 24th May 2021 8:41:08 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Monday, 24th May 2021 8:43:26 pm
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
import { DataService } from 'src/app/_service/data.service';
import { LocalizationService } from 'src/app/_service/localization_service';
import { SidebarService } from 'src/app/_service/uicomponent.service';

@Component({
  selector: 'app-mainwindow',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent {

  public footerMessage: string;
  public title: string;


  constructor(
    public sideBarService: SidebarService,
    public dataService: DataService,
    public localizationService: LocalizationService
  ) {
    this.title = 'HomeMatic Web Explorer'
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
