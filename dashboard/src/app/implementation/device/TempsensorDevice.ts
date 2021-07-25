import { NetworkService } from "../../service/network.service";
import { GenericDevice } from "../Generic";

export class TemperatureSensor extends GenericDevice {

    public isOn: boolean
    public defaultDatapoint: string = 'TEMPERATURE'

    constructor(interfaceName: string, id: string, networkservice: NetworkService) {
        super(interfaceName, id, networkservice);
        this.subscribeToDatapointChanges(`${this.interfaceName}.${this.address}:1.TEMPERATURE`);
        this.subscribeToDatapointChanges(`${this.interfaceName}.${this.address}:1.HUMIDITY`);

    }

    getDeviceStateDescription(dpname: string, template: any): string {
        console.log('temp getDeviceStateDescription %s', dpname, JSON.stringify(template));

        if (typeof template === 'string') {
            const dp = this.getDatapoint(dpname);
            if (dp !== undefined) {
                const cv = parseFloat(dp.curValue);
                return this.formatNumber(template || '%.1f °C', cv);
            }
        } else {
            let dps = template["datapoints"]; // load the dps from template
            let rsl: any[] = [];
            dps.forEach((dpN: string) => { // get values for each uses datapoint
                let dp = this.getDatapoint(dpN);
                if (dp !== undefined) {
                    rsl.push(parseFloat(dp.curValue));
                } else {
                    rsl.push('-');
                }
            })
            return this.formatNumber(template["string"], rsl);

        }
        return 'n/a';
    }

}