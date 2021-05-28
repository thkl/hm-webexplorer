/*
 * **************************************************************
 * File: menuservice.ts
 * Project: hm-webexplorer-client
 * File Created: Thursday, 18th March 2021 11:41:01 am
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:38:15 am
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
import { EventEmitter } from '@angular/core';
import { MenuItem } from '../_interface/menuitem';

export class MenuItemEvent {
    page: string;
    data: any;
}

export class MenuService {
    public menuItemSelected = new EventEmitter<MenuItemEvent>();

    public selectMenuItem(item: any, data?: any): void {
        if (typeof item === 'string') {
            this.menuItemSelected.emit({ page: item, data });
        } else {
            const id = item.id;
            if (id.startsWith('addon_')) {
                window.open(item.url, '_blank');
            } else {
                this.menuItemSelected.emit({ page: id, data });
            }
        }
    }
}

