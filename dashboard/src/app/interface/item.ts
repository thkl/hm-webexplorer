import { Subject } from "rxjs";

export interface _Item {
    name: string;
    id: string;
    icon?: string;
    type: string;
    device: any;
    template: any;
    datapoint: string;
    stateDescription: string;
    ifname: string;
    channel: number;
    controls?: any;
    deviceType?: string;
    _visualStateID: number;
    currentRawState: string;
    visualStateChanged: Subject<number>;
}

export class Item implements _Item {

    name: string;
    id: string;
    icon?: string | undefined;
    type: string;
    device: any;
    template: any;
    datapoint: string;
    stateDescription: string;
    ifname: string;
    channel: number;
    controls?: any;
    deviceType?: string;
    _visualStateID: number = 1;
    currentRawState: string;
    visualStateChanged: Subject<number>;
    visualState: string

    public static get visualStateMinimized(): number { return 0; }
    public static get visualStateNormal(): number { return 1; }
    public static get visualStateMaximized(): number { return 2; }

    constructor(data: any) {

        if (data) {
            this.name = data.name;
            this.id = data.id;
            this.icon = data.icon;
            this.device = data.device;
            this.datapoint = data.datapoint;
            this.ifname = data.ifname;
            this.channel = data.channel;
            this.controls = data.controls;
            this.deviceType = data.deviceType;
            this.type = data.type || data.deviceType;
            this.template = this.prepareTemplate(data.template);
        }

        this.visualStateChanged = new Subject();
    }

    getSerial(): string {
        return this.device;
    }


    getDeviceAddress(): string {
        return `${this.ifname}.${this.getDevice()}`;
    }

    getDevice(): any {
        if (typeof this.device === 'string') {
            return this.device
        }

        if (typeof this.device === 'object') {
            return this.id
        }
    }

    prepareTemplate(tmpl: any): any {
        if (tmpl === undefined) {
            return undefined;
        }

        if (typeof tmpl === 'string') {
            return tmpl;

        } else {

            if (tmpl["datapoints"] !== undefined) {
                let dps: any[] = [];
                tmpl["datapoints"].forEach((dpn: string) => {
                    dps.push(dpn.replace('%device%', this.getDeviceAddress()))
                })
                tmpl["datapoints"] = dps;
            }
            return tmpl;
        }
    }

    getDatapoint(): any {
        if (this.datapoint !== undefined) {
            return this.datapoint.replace('%device%', this.getDeviceAddress())
        }
        if (this.controls !== undefined) {
            let ctrl = Object.values(this.controls)[0];
            if (ctrl) {
                return (ctrl as string).replace('%device%', this.getDeviceAddress())
            }
        }
        return undefined
    }

    getControlDatapointName(key: string): any {
        if (this.controls) {
            let ct = this.controls[key];
            if (ct) {
                return ct.replace('%device%', this.getDeviceAddress())
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    get visualStateID(): number {
        return this._visualStateID;
    }

    set visualStateID(newID: number) {
        console.log('SetNewState %s %d', this.name, newID)
        this._visualStateID = newID;
        switch (newID) {
            case Item.visualStateMinimized:
                this.visualState = 'minimized'
                break
            case Item.visualStateNormal:
                this.visualState = 'normal'
                break
            case Item.visualStateMaximized:
                this.visualState = 'maximized'
                break
            default:
                this.visualState = 'normal'
        }
        this.visualStateChanged.next(newID);
    }

}