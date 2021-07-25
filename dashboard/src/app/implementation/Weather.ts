import { Subject } from "rxjs";
import { NetworkService } from "../service/network.service";

export class WeatherItem {

    private iconVariable: string;
    private msgVariable: string;
    private networkservice: NetworkService;

    private iconState: string;
    private msgState: string;

    public visualStateChanged: Subject<{ icon: string, message: string }>;


    constructor(
        networkservice: NetworkService
    ) {
        this.networkservice = networkservice;
        this.visualStateChanged = new Subject();
        setInterval(() => {
            this.updateWeather();
        }, 900000); // 15 min
        this.updateWeather();
    }

    setVariables(weatherBlock: any): void {
        if ((weatherBlock !== undefined) && (weatherBlock.icon)) {
            this.iconVariable = weatherBlock.icon;
        }

        if ((weatherBlock !== undefined) && (weatherBlock.msg)) {
            this.msgVariable = weatherBlock.msg;
        }
        this.updateWeather();
    }

    updateWeather(): void {
        if (this.iconVariable !== undefined) {
            this.networkservice.getJsonData(`variable/${this.iconVariable}/value`).then(newValue => {
                if (this.iconState !== newValue.state) {
                    this.iconState = newValue.state;
                    this.visualStateChanged.next({ icon: this.iconState, message: this.msgState });
                }
            })
        }

        if (this.msgVariable !== undefined) {
            this.networkservice.getJsonData(`variable/${this.msgVariable}/value`).then(newValue => {
                if (this.msgState !== newValue.state) {
                    this.msgState = newValue.state;
                    this.visualStateChanged.next({ icon: this.iconState, message: this.msgState });
                }
            })
        }
    }
}