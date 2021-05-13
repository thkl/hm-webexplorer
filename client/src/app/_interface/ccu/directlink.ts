import { CCUChannel } from './channel';
import { CCUDevice } from './device';
import { CCUEasymodeTemplate } from './easymodetemplate';

export interface CCUDirectlink {
    DESCRIPTION: string;
    FLAGS: number;
    NAME: string;
    RECEIVER: string;
    RECEIVER_PARAMSET: [key: string, value: string];
    SENDER: string;
    SENDER_PARAMSET: [key: string, value: string];
    currentEasyModeSet?: string;
    easyModeSets?: CCUEasymodeTemplate[];

    senderDevice?: CCUDevice;
    recvDevice?: CCUDevice;
    cSender?: CCUChannel;
    cReceiver?: CCUChannel;
}
