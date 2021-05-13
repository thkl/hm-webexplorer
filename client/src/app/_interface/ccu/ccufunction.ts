import { CCUChannel } from "./channel";

export interface CCUFunction {
    id: number;
    name: string;
    description: string;
    channels: number[];
    channelObjects?: CCUChannel[];
}
