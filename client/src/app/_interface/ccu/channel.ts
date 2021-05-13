import { CCUFunction } from './ccufunction';
import { CCUDatapoint } from './datapoint';
import { CCURoom } from './room';

export interface CCUChannel {
    id: number;
    channelIndex: number;
    address: string;
    channeltype: number;
    parentId: number;
    type: string;
    name: string;
    deviceType?: string;
    direction: number;
    rooms: number[];
    functions: number[];
    label: string;
    aes: boolean;
    datapoints: CCUDatapoint[];
    isReadable: boolean;
    isWritable: boolean;
    isEventable: boolean;
    isVirtual: boolean;
    roomNames?: string[];
    functionNames?: string[];
    roomObjects?: CCURoom[];
    functionObjects?: CCUFunction[];
}
