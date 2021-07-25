
import { NetworkService } from "../../service/network.service";
import { GenericDevice } from "../Generic";

export class Key extends GenericDevice {

    public isOn: boolean;

    constructor(interfaceName: string, id: string, networkservice: NetworkService) {
        super(interfaceName, id, networkservice);
        this.isOn = false;
    }

    getDeviceStateDescription(dpname: string, template: any): string {
        return ''
    }

    pressKey(dpname: string): void {
        let dp = this.getDatapoint(dpname);
        if (dp) {
            dp.curValue = 1;
            this.isOn = true;
            this.setDatapoint(dp);
            setTimeout(() => { this.isOn = false }, 50);
        } else {
            this.addDatapoint(dpname, dpname);
        }
    }

}
