import { Item } from "./item";

export interface _Page {
    id: string;
    name: string;
    isActive: boolean;
    isRoot: boolean;
    items: Item[];
}

export class Page implements _Page {
    id: string;
    name: string;
    isActive: boolean;
    isRoot: boolean;
    items: Item[];


    constructor(data: any) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.isActive = data.isActive;
            this.isRoot = data.isRoot;
        }
        this.items = [];
    }

    addItem(item: Item): void {
        this.items.push(item);
    }
}