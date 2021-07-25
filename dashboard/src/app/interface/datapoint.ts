import { Subject } from "rxjs";

export interface Datapoint {
    name: string;
    curValue?: any;
    changed: Subject<any>;
}
