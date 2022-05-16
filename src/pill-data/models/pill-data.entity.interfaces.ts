export interface ISavePillChannelData {
    lineUID: string;
    channelId: string;
    pillName: string;
    total?: number;
    stock: number;
}

export interface ISaveTakeTime {
    cid: string;
    time: string;
}