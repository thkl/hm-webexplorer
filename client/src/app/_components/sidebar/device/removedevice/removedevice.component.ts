/*
 * **************************************************************
 * File: removedevice.component.ts
 * Project: hm-webexplorer-client
 * File Created: Tuesday, 16th March 2021 12:44:18 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 10:03:14 am
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
import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/_service/data.service';

@Component({
  selector: 'app-removedevice',
  templateUrl: './removedevice.component.html',
  styleUrls: ['./removedevice.component.sass']
})
export class SideBarRemovedeviceComponent implements OnInit {

  @Input() onDelete: EventEmitter<object>;
  @Input() data: any;
  constructor(
    public dataService: DataService
  ) { }

  ngOnInit(): void {
  }


  removeDevice(): void {
    this.dataService.deviceProvider.removeDevice(this.data.serial).then(() => {
      this.onDelete.emit(null);
    });
  }
}
