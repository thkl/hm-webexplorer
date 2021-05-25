/*
 * **************************************************************
 * File: functionprovider.ts
 * Project: hm-webexplorer-client
 * File Created: Sunday, 21st March 2021 7:49:45 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:39:02 am
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
import { NetworkService } from "../_service/network.service";
import { CCUChannel } from "../_interface/ccu/channel";
import { CCUFunction } from "../_interface/ccu/ccufunction";
import { DataService } from '../_service/data.service';

export class FunctionProvider {

    private $functionList: CCUFunction[] = new Array<CCUFunction>();
    private $functionList$: BehaviorSubject<CCUFunction[]>;
    private networkService: NetworkService;

    constructor(
        private dataService: DataService
    ) {
        this.$functionList$ = new BehaviorSubject(new Array<CCUFunction>());
        this.networkService = dataService.networkService;
        this.refresh();
    }


    refresh() {
        if (this.networkService.serverUrl !== undefined) {
            this.udpateFunctionList();
        }
    }

    get functionList(): CCUFunction[] {
        return this.$functionList;
    }

    udpateFunctionList(): void {
        this.networkService.getJsonData('function')
            .then(result => {
                console.log('ALL Data: ', result);
                const key = 'functions';
                this.$functionList = result[key];
                this.updateChannels();
                this.$functionList$.next(this.$functionList);
            })
            .catch(error => {
                console.log('Error Getting Data: ', error);
            });
    }

    createFunction(newFunctionName: string): void {
        this.networkService.putJsonData('function', { newFunctionName }).then(() => {
            this.udpateFunctionList();
        });
    }


    removeFunction(functionId: number): Promise<any> {
        return this.networkService.deleteRequest(`function/${functionId}`);
    }

    functionById(functionId): CCUFunction {
        let rslt = this.$functionList.filter(aFunction => {
            return (aFunction.id === functionId)
        });
        return (rslt.length > 0) ? rslt[0] : undefined
    }


    subscribeToFunctionList(): Observable<CCUFunction[]> {
        return this.$functionList$.asObservable();
    }

    updateChannels(): void {
        this.$functionList.forEach(ccuFunction => {
            ccuFunction.channelObjects = [];
            ccuFunction.channels.forEach(channelID => {
                const chnl = this.dataService.deviceProvider.channelWithId(channelID);
                if (chnl) {
                    ccuFunction.channelObjects.push(chnl);
                }
            });
        })
    }

    updateFunctionFromNetwork(data: any): void {
        if (data) {
            let oFunction = this.functionById(data.id);
            if (oFunction) {
                oFunction.name = data.name;
                oFunction.channels = data.channels;
            }
        }
    }

    saveFunction(data: any): void {
        this.networkService.patchJsonData(`function/${data.id}`, { name: data.name, description: data.description })
    }

}