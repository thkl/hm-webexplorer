/*
 * **************************************************************
 * File: interface.component.ts
 * Project: hm-webexplorer-client
 * File Created: Friday, 12th March 2021 2:58:06 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 10:02:50 am
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
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-interface',
  template: '<table style="width:100%">\
              <tr>\
                <td>Objekt ID</td>\
                <td>{{data.id}}</td>\
              </tr>\
              <tr>\
                <td>Interface name</td>\
                <td>{{data.name}}</td>\
              </tr>\
              <tr>\
                <td>Info</td>\
                <td>{{data.info}}</td>\
              </tr>\
              <tr>\
                <td>RPC Url</td>\
                <td>{{data.url}}</td>\
              </tr>\
            </table>'
})

export class SideBarInterfaceComponent implements OnInit {
  public apiHost: string;
  @Input() data: any;
  constructor() { }

  ngOnInit(): void {
  }

}
