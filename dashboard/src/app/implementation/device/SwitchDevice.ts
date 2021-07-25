import { NetworkService } from "../../service/network.service";
import { GenericDevice } from "../Generic";

export class SwitchDevice extends GenericDevice {

    public isOn: boolean;

    constructor(interfaceName: string, id: string, networkservice: NetworkService) {
        super(interfaceName, id, networkservice);
        this.subscribeToDatapointChanges(`${this.interfaceName}.${this.address}:1.STATE`);
    }

    getDeviceStateDescription(dpname: string, template: any): string {
        let dp = this.getDatapoint(dpname);
        if (dp) {
            if (this.isTrue(dp.curValue) === true) {
                this.isOn = true;
                return this.getTemplateItem(template, 'label_on', 'On');
            } else {
                this.isOn = false;
                return this.getTemplateItem(template, 'label_off', 'Off');
            }
        } else {
            return 'n/a';
        }
    }

    setOn(dpname: string, isOn: boolean): void {
        let dp = this.getDatapoint(dpname);
        dp.curValue = isOn;
        this.setDatapoint(dp);
    }

    getOnState(dpname: string): boolean {
        let dp = this.getDatapoint(dpname);
        return (dp.curValue === true);
    }
}
