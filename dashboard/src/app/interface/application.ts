
import { WeatherItem } from "../implementation/Weather";
import { NetworkService } from "../service/network.service";
import { Item } from "./item";
import { Page } from "./page";

export class Application {

    weather: WeatherItem;
    pages: Page[];
    header: Item[];
    currentPage?: Page;

    deviceList: any[];

    constructor(networkservice: NetworkService) {
        this.pages = [];
        this.header = [];
        this.deviceList = [];
        this.weather = new WeatherItem(networkservice);
    }
}
