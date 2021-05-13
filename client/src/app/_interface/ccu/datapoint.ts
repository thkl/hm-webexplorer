export interface CCUDatapoint {

    id: number;
    name: string;
    hssid: string;
    operations: number;
    parentChannel: number;
    valuetype: number;
    valuesubtype: number;
    valuelist: string[];
    unit: string;
    rawUnit: string;
    factor: number;
    defaultDP?: boolean;
    min: string;
    max: string;
    value?: any;
    lastChange?: Date;
}
