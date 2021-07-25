import { NetworkService } from "../../service/network.service";
import { GenericDevice } from "../Generic";

export class DimmerDevice extends GenericDevice {

    public isOn: boolean
    public isWorking: boolean = false

    private _isWorkingDp: string

    constructor(interfaceName: string, id: string, networkservice: NetworkService) {
        super(interfaceName, id, networkservice);
        this.subscribeToDatapointChanges(`${this.interfaceName}.${this.address}:1.LEVEL`);
    }

    set isWorkingDp(dpName: string) {
        this._isWorkingDp = dpName
    }

    getDeviceStateDescription(dpname: string, template: any): string {
        let dp = this.getDatapoint(dpname);
        let cv = parseFloat(dp.curValue)
        if (cv === 0) {
            this.isOn = false;
            return this.getTemplateItem(template, 'label_off', 'Off');
        } else if (cv === 1) {
            this.isOn = true;
            return this.getTemplateItem(template, 'label_on', 'On');
        } else {
            this.isOn = true;
            const tmp = this.getTemplateItem(template, 'label_value', '%.1f %');
            return this.formatNumber(tmp, (dp.curValue * 100))
        }

    }


    updateDatapoint(name: string, ts: number, state: any) {
        super.updateDatapoint(name, ts, state);

        if (name === this._isWorkingDp) {
            this.isWorking = state;
        }
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