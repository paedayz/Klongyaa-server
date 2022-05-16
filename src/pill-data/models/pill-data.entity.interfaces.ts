export interface ISavePillChannelData {
    lineUID: string;
    channelID: string;
    pillName: string;
    total?: number;
    stock: number;
}

export interface ISaveTakeTime {
    cid: string;
    time: string;
}

export interface ISaveRealPill {
    pillName: string;
    property: string;
    effect: string;
}

export interface ISaveDangerPill {
    rid: string;
    pillName: string;
    reason: string;
}

export interface ISaveCidRid {
    cid: string;
    rid: string;
}

export interface ISaveLogHistory {
    cid: string;
    uid: string;
    task: string;
}