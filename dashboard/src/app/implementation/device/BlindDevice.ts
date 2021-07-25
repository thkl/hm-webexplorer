import { NetworkService } from "src/app/service/network.service";
import { GenericDevice } from "../Generic";

export class Blind extends GenericDevice {

    public isOn: boolean
    public isWorking: boolean = false

    private _isWorkingDp: string

    constructor(interfaceName: string, id: string, networkservice: NetworkService) {
        super(interfaceName, id, networkservice);
        this.subscribeToDatapointChanges(`${this.interfaceName}.${this.address}:1.LEVEL`);
        this.subscribeToDatapointChanges(`${this.interfaceName}.${this.address}:1.WORKING`);
    }

    set isWorkingDp(dpName: string) {
        this._isWorkingDp = dpName
    }

    getDeviceStateDescription(dpname: string, template: any): string {
        let dp = this.getDatapoint(dpname);
        let cv = parseFloat(dp.curValue)
        if (cv === 0) {
            return 'Closed';
        } else if (cv === 1) {
            return 'Open';
        } else {
            return this.formatNumber('%d %', (dp.curValue * 100))
        }
    }

    updateDatapoint(name: string, ts: number, state: any) {
        super.updateDatapoint(name, ts, state);

        if (name === this._isWorkingDp) {
            this.isWorking = state;
        }
    }

    stop(dpname: string): void {
        let dp = this.getDatapoint(dpname);
        dp.curValue = true;
        this.setDatapoint(dp);
    }

    setLevel(dpname: string, newLevel: number): void {
        let dp = this.getDatapoint(dpname);
        dp.curValue = (newLevel / 100);
        this.setDatapoint(dp);
    }

    getLevel(dpname: string): number {
        let dp = this.getDatapoint(dpname);
        return parseFloat(dp.curValue) * 100;
    }
}