import { NetworkService } from "../../service/network.service";
import { DimmerDevice } from "./DimmerDevice";

export class RGBDevice extends DimmerDevice {


    constructor(interfaceName: string, id: string, networkservice: NetworkService) {
        super(interfaceName, id, networkservice);
        this.subscribeToDatapointChanges(`${this.interfaceName}.${this.address}:1.LEVEL`);
        this.subscribeToDatapointChanges(`${this.interfaceName}.${this.address}:1.RGB`);
    }

    setColor(dpname: string, newColor: string): void {
        let dp = this.getDatapoint(dpname);
        dp.curValue = newColor;
        this.setDatapoint(dp);
    }
}