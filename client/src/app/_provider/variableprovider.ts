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
import { CCUConstants } from './constants';

export class VariableProvider {

    private $variableList: CCUVariable[] = new Array<CCUVariable>();
    private $variableList$: BehaviorSubject<CCUVariable[]>;


    constructor(
        private networkService: NetworkService
    ) {
        this.$variableList$ = new BehaviorSubject(new Array<CCUVariable>());
        this.refresh();
    }

    refresh() {
        if (this.networkService.serverUrl !== undefined) {
            this.udpateVariableList();
        }
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

    updateVariableValue(variable: CCUVariable): Promise<any> {
        return new Promise(resolve => {
            this.networkService.getJsonData(`variable/${variable.id}/value`).then(result => {
                variable._state = result.state
                resolve(variable._state)
            })
        })
    }

    udpateVariableList(): void {
        this.networkService.getJsonData('variable')
            .then(result => {
                console.log('ALL Data: ', result);
                const key = 'variables';
                this.$variableList = [];
                result[key].forEach(variable => {
                    let oVar = {
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
                    } as CCUVariable;
                    this.generateUserfriendlyState(oVar);
                    this.$variableList.push(oVar);
                });
                this.$variableList$.next(this.$variableList);
            });
    }

    generateUserfriendlyState(variable: CCUVariable): void {
        switch (variable.valuetype) {
            case CCUConstants.ivtString:
                variable.strState = variable._state;
                variable._control = 0;
                break;
            case CCUConstants.ivtBinary:
                if (variable.subtype === CCUConstants.istAlarm) {
                    variable._control = 1;
                    if (variable._state === CCUConstants.asOncoming) {
                        variable.strState = variable.valueName1;
                        variable._alarmState = true;
                    } else {
                        variable.strState = variable.valueName0;
                        variable._alarmState = false;
                    }
                } else {
                    variable.strState = ((variable._state === 0) || (variable._state === false)) ? variable.valueName0 : variable.valueName1
                    variable._control = 2;
                }
                break;
            case CCUConstants.ivtInteger:
                if (variable.subtype === CCUConstants.istEnum) {
                    const vl = variable.valuelist.split(';');
                    if (vl.length > variable._state) {
                        variable.strState = vl[variable._state];
                        variable._control = 3;

                        variable._cValueList = {};

                        let id = 0;
                        vl.forEach(strVl => {
                            variable._cValueList[id] = strVl;
                            id = id + 1;
                        })

                    } else {
                        variable.strState = '???';
                        variable._control = 3;
                    }
                } else {
                    variable.strState = String(variable._state);
                    variable._control = 0;
                }
                break;
            default:
                variable.strState = String(variable._state);
                variable._control = 0;
        }
    }

    subscribeToVariableList(): Observable<CCUVariable[]> {
        return this.$variableList$.asObservable();
    }

    updateVariableFromNetwork(data: any): void {
        if (data) {
            data.forEach(oData => {
                let oVariable = this.variableById(oData.id);
                if (oVariable) {
                    oVariable.name = oData.name;
                    oVariable._state = oData.state;
                    this.generateUserfriendlyState(oVariable);
                }
            });
        }
    }

    saveVariable(variable: CCUVariable): void {
        this.networkService.patchJsonData(`variable/${variable.id}`, { variable })
    }
}