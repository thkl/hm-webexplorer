import { CCUChannel } from './channel';

export interface CCUDevice {
    id: number;
    serial: string;
    name: string;
    channels: CCUChannel[];
    type: string;
    interface: number;
    visible: boolean;
    inuse: boolean;
    enabled: boolean;
    interfaceName: string;
    access: number;
    unerasable: boolean;
    readyconfig?: boolean;
    readyconfigchannels?: boolean;
    rssi?: number;
    voltage?: number;
}
