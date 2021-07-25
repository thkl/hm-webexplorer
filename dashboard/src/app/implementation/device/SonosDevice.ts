import { NetworkService } from "../../service/network.service";
import { GenericDevice } from "../Generic";

export class SonosDevice extends GenericDevice {

    public isOn: boolean;
    public lastArtwork: string;

    constructor(interfaceName: string, id: string, networkservice: NetworkService) {
        super(interfaceName, id, networkservice);
        console.log('Init Sonos Device %s %s', interfaceName, id);
        this.subscribeToDatapointChanges(`${this.interfaceName}.${this.address}:19.CURRENT_TRACK`);
        this.subscribeToDatapointChanges(`${this.interfaceName}.${this.address}:19.TRANSPORT_STATE`);
        this.subscribeToDatapointChanges(`${this.interfaceName}.${this.address}:19.TRACK_ART`);
    }


    getDeviceStateDescription(dpname: string, template: any): string {
        let dp = this.getDatapoint(dpname);
        return dp.curValue;
    }

}