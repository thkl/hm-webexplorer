/*
 * **************************************************************
 * File: variableprovider.ts
 * Project: hm-webexplorer-client
 * File Created: Monday, 22nd March 2021 7:25:16 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:38:40 am
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

import { BehaviorSubject, Observable } from 'rxjs';
import { CCUVariable } from '../_interface/ccu/variable';
import { NetworkService } from "../_service/network.service";

export class VariableProvider {

    private $variableList: CCUVariable[] = new Array<CCUVariable>();
    private $variableList$: BehaviorSubject<CCUVariable[]>;


    constructor(
        private networkService: NetworkService
    ) {
        this.$variableList$ = new BehaviorSubject(new Array<CCUVariable>());

        this.udpateVariableList();
    }

    variableById(variableId: number): CCUVariable {
        const rslt = this.$variableList.filter(variable => {
            return (variable.id === variableId);
        });
        return (rslt.length > 0) ? rslt[0] : undefined;
    }

    get variableList(): CCUVariable[] {
        return this.$variableList;
    }

    udpateVariableList(): void {
        this.networkService.getJsonData('variable')
            .then(result => {
                console.log('ALL Data: ', result);
                const key = 'variables';
                this.$variableList = [];
                result[key].forEach(variable => {
                    this.$variableList.push({
                        id: variable.id,
                        name: variable.name,
                        unerasable: variable.unerasable,
                        valuetype: variable.valuetype,
                        subtype: variable.subtype,
                        minvalue: variable.minvalue,
                        maxvalue: variable.maxvalue,
                        valuelist: variable.valuelist,
                        unit: unescape(variable.unit),
                        valueName0: unescape(variable.valueName0),
                        valueName1: unescape(variable.valueName1),
                        _state: variable.state,
                        _lastUpdate: new Date()
                    } as CCUVariable);
                });
                this.$variableList$.next(this.$variableList);
            });
    }


    subscribeToVariableList(): Observable<CCUVariable[]> {
        return this.$variableList$.asObservable();
    }

}