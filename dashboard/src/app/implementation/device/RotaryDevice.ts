import { NetworkService } from "../../service/network.service";
import { GenericDevice } from "../Generic";

export class RotaryDevice extends GenericDevice {

    public isOn: boolean;

    constructor(interfaceName: string, id: string, networkservice: NetworkService) {
        super(interfaceName, id, networkservice);
        this.subscribeToDatapointChanges(`${this.interfaceName}.${this.address}:1.STATE`);
    }


    getDeviceStateDescription(dpname: string, template: any): string {
        let dp = this.getDatapoint(dpname);
        if (dp) {
            console.log(dp.curValue)
            switch (parseInt(dp.curValue)) {
                case 0:
                    this.isOn = false;
                    return this.getTemplateItem(template, 'label_closed', 'Closed');
                case 1:
                    this.isOn = true;
                    return this.getTemplateItem(template, 'label_tilted', 'Titled');
                case 2:
                    this.isOn = true;
                    return this.getTemplateItem(template, 'label_open', 'Open');
                default:
                    return '?';
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
            return (parseInt(dp.curValue) > 0);
        } else {
            return false;
        }
    }
}
