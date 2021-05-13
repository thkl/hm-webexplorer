/*
 * **************************************************************
 * File: devicesettings.component.ts
 * Project: hm-webexplorer-client
 * File Created: Monday, 15th March 2021 2:31:43 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 10:03:23 am
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
import { NetworkService } from 'src/app/_service/network.service';

@Component({
  selector: 'app-devicesettings',
  templateUrl: './devicesettings.component.html',
  styleUrls: ['./devicesettings.component.sass']
})
export class SideBarDevicesettingsComponent implements OnInit {

  constructor(
    private networkService: NetworkService
  ) {

  }

  @Input() data: any;

  setDirty(): void {
    // set a flag that the user changed something in the settings
    this.data.paramsetIsDirty = true;
  }



  ngOnInit(): void {
    if (this.data.paramsets === undefined) {
      // first fetch the MASTER Paramsets
      this.data.paramsets = {};
      const pskey = 'paramset';
      const ctkey = 'controls';
      this.networkService.getJsonData(`${pskey}/${this.data.serial}`).then(pset => {
        this.data.paramsets[0] = pset[pskey];
      });
      this.data.channels.forEach(channel => {
        this.networkService.getJsonData(`${pskey}/${this.data.serial}/${channel.channelIndex}`).then(pset => {
          const ctrl = pset[ctkey];
          const cpset = pset[pskey];
          Object.keys(cpset).forEach(parameter => {
            const ctrlElement = ctrl[parameter];
            if (ctrlElement) {
              const ctrlElementKey = 'control_element';
              cpset[parameter][ctrlElementKey] = ctrlElement;
            }
          });
          this.data.paramsets[channel.channelIndex] = cpset;
        });
      });
    }
  }

}
