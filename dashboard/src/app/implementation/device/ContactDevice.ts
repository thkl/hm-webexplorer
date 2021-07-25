import { NetworkService } from "../../service/network.service";
import { GenericDevice } from "../Generic";

export class ContactDevice extends GenericDevice {

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
                return this.getTemplateItem(template, 'label_on', 'Open');

            } else {
                this.isOn = false;
                return this.getTemplateItem(template, 'label_off', 'Closed');
            }
        } else {
            return 'n/a';
        }
    }

    getOnState(dpname: any): boolean {
        if (dpname === undefined) {
            dpname = `${this.interfaceName}.${this.address}:1.STATE`;
        }
        let dp = this.getDatapoint(dpname);
        if (dp) {
            return (this.isTrue(dp.curValue) === true);
        } else {
            console.log('%s not found', dpname);
            return false;
        }
    }
}
