import { Subject } from "rxjs";
import { Datapoint } from "../interface/datapoint";
import * as PRINTJ from 'printj';
import { NetworkService } from "../service/network.service";

export class GenericDevice {
    public name: string;
    public dp?: string;
    public address: string;
    public icon?: string;
    public type: string;
    public interfaceName: string;
    public datapoints: Record<string, Datapoint> = {}
    public notifications: string[] = [];
    public template: string;
    public changed: Subject<any>;
    public defaultDatapoint: string;
    public stateDescription: string;
    private networkservice: NetworkService;

    constructor(interfaceName: string, address: string, networkservice: NetworkService) {
        console.log('Device::constructor %s', address)
        this.address = address;
        this.interfaceName = interfaceName;
        this.changed = new Subject();
        this.stateDescription = '';
        this.datapoints = {};
        this.networkservice = networkservice;
    }

    getNetworkService(): NetworkService {
        return this.networkservice;
    }

    addDatapoint(key: string, dpName: string): Datapoint {
        const dp = { name: dpName, curValue: '', changed: new Subject() }
        this.datapoints[key] = dp;
        return dp;
    }

    subscribeToDatapointChanges(dpName: string): void {
        console.log('Subscribing %s', dpName);
        this.notifications.push(dpName);
    }

    getDatapoints(): Datapoint[] {
        return Object.values(this.datapoints);
    }

    getDatapoint(key: string): Datapoint {
        return this.datapoints[key];
    }

    getDatapointByName(name: string): any {
        let dps = Object.values(this.datapoints).filter((dp) => {
            return dp.name === name;
        })
        return dps.length > 0 ? dps[0] : undefined;
    }

    getDeviceStateDescription(dpname: string, template: any): string {
        const dp = (dpname !== undefined) ? this.getDatapointByName(dpname) : Object.values(this.datapoints)[0]
        if (dp) {

            if ((template) && (typeof template === 'string')) {
                let strTemp = template as string
                return this.formatNumber(strTemp, dp.curValue)
            } else {
                return dp.curValue
            }
        } else {
            return ''
        }
    }

    getRawState(dpname: string): any {
        const dp = (dpname !== undefined) ? this.getDatapointByName(dpname) : Object.values(this.datapoints)[0]
        if (dp) {
            return dp.curValue;
        }
        return undefined;
    }

    updateStates(): Promise<any> {
        console.log('Updating statuts on %s', this.address)
        return new Promise(async (resolve) => {
            this.networkservice.getJsonData(`state/${this.address}`).then(result => {
                if ((result) && (result.error === undefined)) {
                    result.forEach((element: { name: string; ts: any; state: any; }) => {
                        this.updateDatapoint(element.name, element.ts, element.state);
                    })
                }
                resolve(true);
            })
        })
    }


    formatNumber(format: string, value: any): string {
        if (typeof value === 'number') {
            return PRINTJ.sprintf(format, value);
        } else {
            return PRINTJ.vsprintf(format, value);
        }
    }

    updateDatapoint(name: string, ts: number, state: any) {
        let dp = this.getDatapointByName(name);
        if (dp === undefined) {
            dp = this.addDatapoint(name, name);
        }
        if (dp) {
            dp.curValue = state;
        }
        if (this.notifications.indexOf(name) > -1) {
            this.changed.next(name);
        }
    }

    setDatapoint(datapoint: Datapoint): Promise<any> {
        return this.networkservice.putJsonData(`state/${datapoint.name}`, { newState: datapoint.curValue })
    }

    getTemplateItem(template: any, key: string, deflt: string): string {
        if ((template !== undefined) && (typeof template === 'object')) {
            if (template[key]) {
                return template[key];
            }
        }
        return deflt;
    }

    isTrue(inp: any): boolean {
        if (inp === true) {
            return true
        }
        if (inp === 1) {
            return true
        }
        if (inp === 'true') {
            return true
        }
        return false
    }
}