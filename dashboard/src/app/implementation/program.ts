
import { NetworkService } from "../service/network.service";
import { GenericDevice } from "./Generic";

export class Program extends GenericDevice {

    public isOn: boolean;

    constructor(interfaceName: string, id: string, networkservice: NetworkService) {
        super(interfaceName, id, networkservice);
        this.isOn = false;
    }

    getDeviceStateDescription(dpname: string, template: any): string {
        return ''
    }

    executeProgram(dpname: string): void {
        this.isOn = true;
        this.getNetworkService().getJsonData(`program/${dpname}/execute`)
        setTimeout(() => { this.isOn = false }, 50);
    }

}
