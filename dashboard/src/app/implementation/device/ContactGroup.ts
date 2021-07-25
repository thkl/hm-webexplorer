import { ConsoleLogger } from "node_modules.nosync/@angular/compiler-cli/ngcc";
import { NetworkService } from "../../service/network.service";
import { GenericDevice } from "../Generic";
import { ContactDevice } from "./ContactDevice";

export class ContactGroupDevice extends GenericDevice {

    public isOn: boolean;
    private subdeviceList: ContactDevice[];
    private numOpen: number;

    constructor(interfaceName: string, id: string, networkservice: NetworkService) {
        super(interfaceName, id, networkservice);
        this.subdeviceList = [];
    }

    addDevice(device: ContactDevice) {
        console.log('Adding Single DP %s', device.address)
        this.subdeviceList.push(device);
        // Emit all changes of subdevices
        device.changed.subscribe((changedDP) => {
            console.log('GroupMember Changed ..')
            this.changed.next(changedDP);
        })
    }

    updateStates(): Promise<any> {
        return new Promise(resolve => {
            this.subdeviceList.forEach(device => {
                device.updateStates();
            })
            resolve(true);
        })
    }

    getDeviceStateDescription(dpname: string, template: any): string {
        // update all Datepoints in List
        console.log('ContactGroup getDeviceStateDescription')
        this.getOnState(dpname);
        let rslt;
        if (this.isOn) {
            rslt = this.getTemplateItem(template, 'label_on', ' %d Open');
        } else {
            rslt = this.getTemplateItem(template, 'label_off', 'Closed');
        }
        return this.formatNumber(rslt, this.numOpen);
    }

    getOnState(dpname: any): boolean {
        this.numOpen = 0;
        this.subdeviceList.forEach((device) => {
            console.log('Check %s', device.address)
            if (device.getOnState(undefined) === true) {
                console.log('Device %s is on', device.address)
                this.numOpen = this.numOpen + 1;
            } else {
                console.log('Device %s is off', device.address)
            }
        });
        console.log('GetOnState %d', this.numOpen);
        this.isOn = (this.numOpen > 0);
        return this.isOn;
    }
}
