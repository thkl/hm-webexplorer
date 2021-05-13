/*
 * **************************************************************
 * File: localization_service.ts
 * Project: hm-webexplorer-client
 * File Created: Thursday, 18th March 2021 12:18:43 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:38:27 am
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
import { EventEmitter, Injectable } from '@angular/core';
import { NetworkService } from './network.service';

@Injectable({
    providedIn: 'root'
})
export class LocalizationService {

    private localizations: { [key: string]: any };

    constructor(
        private networkService: NetworkService
    ) {
        this.localizations = {};
    }

    public loadValues(lang: string): void {
        this.networkService.getJsonData('config/localization/' + lang).then(locs => {
            this.localizations = locs;
        });
    }

    public parameterLocalization(input: string, device?: string, partner?: string): string {
        if ((device) && (partner)) {
            const section = this.localizations[device];
            if (section) {
                if ((section[partner]) && (section[partner][input])) {
                    return unescape(section[partner][input]);
                }
            }
        }

        if (device) {
            const section = this.localizations[device];
            if (section) {
                let msg = input;
                if ((msg) && (device === 'REGA') && (msg.indexOf('${') === 0)) {
                    msg = msg.substr(2, msg.length - 3);
                }
                if (section[msg]) {
                    return unescape(section[msg]);
                }
            }
        }


        let pl = this.localizations.PNAME;
        if (pl[input]) {
            return unescape(pl[input]);
        }

        pl = this.localizations.GENERIC;
        if (pl[input]) {
            return unescape(pl[input]);
        }

        return input;
    }
}
