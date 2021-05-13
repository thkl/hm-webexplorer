/*
 * **************************************************************
 * File: uiprovider.ts
 * Project: hm-webexplorer-client
 * File Created: Sunday, 11th April 2021 12:22:26 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:38:45 am
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
import { DataService } from "../_service/data.service";

export class UIProvider {
    private _recentObjects: { [key: string]: any[] };

    constructor(private dataService: DataService) {
        this._recentObjects = {};
    }

    addRecentlyUsedObject(key: string, obj: any): void {
        let buffer = this._recentObjects[key];
        if (buffer === undefined) {
            buffer = [];
        }

        if (buffer.indexOf(obj) !== -1) {
            return;
        }

        if (buffer.length > 5) {
            buffer.shift() // remove the oldest one
        }

        buffer.push(obj);
        this._recentObjects[key] = buffer;
    }

    recentlyUsed(key: string): any[] {
        return this._recentObjects[key];
    }
}