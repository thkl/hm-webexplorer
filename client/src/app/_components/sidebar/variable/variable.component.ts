/*
 * **************************************************************
 * File: variable.component.ts
 * Project: hm-webexplorer-client
 * File Created: Sunday, 14th March 2021 6:37:11 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 10:02:27 am
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
  selector: 'app-variable',
  templateUrl: './variable.component.html'
})
export class SideBarVariableComponent implements OnInit {

  @Input() data: any;
  @Input() onSave: EventEmitter<object>;
  public variableData: any;


  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.variableData = JSON.parse(JSON.stringify(this.data)); // make a copy

    this.onSave.subscribe(() => {
      // copy back the attributes
      this.data.name = this.variableData.name;
      // Update type min max etc
      this.data.valuetype = this.variableData.valuetype
      this.data.subtype = this.variableData.subtype
      this.data.minvalue = this.variableData.minvalue
      this.data.maxvalue = this.variableData.maxvalue
      this.data.valuelist = this.variableData.valuelist
      this.data.unit = this.variableData.unit
      this.data.valueName0 = this.variableData.valueName0
      this.data.valueName1 = this.variableData.valueName1
      this.data._state = this.variableData._state;
    });
    // Sice we are using a copy pass the original data to the updater
    this.dataService.variableProvider.updateVariableValue(this.data).then((newState) => {
      // and update the copy
      console.log('newState %s', newState)
      this.variableData._state = newState;
    })

  }

}
