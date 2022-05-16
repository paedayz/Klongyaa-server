import { Expose } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";
import { IPillChannelDataRes, IRealPillData } from "../interfaces/pill-data.service.interfaces";

export class AddPillChannelDataBodyDto {
    @IsString()
    @Expose({name: 'channel_id'})
    channelID: string;

    @IsString()
    @Expose({name: 'pill_name'})
    pillName: string;

    // @IsNumber({allowNaN: true})
    total?: number;

    @IsNumber()
    stock: number;

    @IsString({each: true})
    @Expose({name: 'take_times'})
    takeTimes: string[]
}

export class PillChannelDataResDto {
    constructor(pillChannelData: IPillChannelDataRes) {
        this.cid = pillChannelData.cid;
        this.channel_id = pillChannelData.channelID;
        this.pill_name = pillChannelData.pillName;
        this.total = pillChannelData.total;
        this.stock = pillChannelData.stock;
        this.take_times = pillChannelData.takeTimes;
        this.created_at = pillChannelData.createdAt
    }

    @IsString()
    cid: string;

    @IsString()
    @Expose({name: 'channelID'})
    channel_id: string;

    @IsString()
    @Expose({name: 'pillName'})
    pill_name: string;

    @IsString()
    total?: number;

    @IsString()
    stock: number;

    @IsString({each: true})
    @Expose({name: 'takeTimes'})
    take_times: string[]

    @IsDate()
    @Expose({name: 'createdAt'})
    created_at: Date
}

export class RealPillDataDto {
    @IsString()
    pillName: string;

    @IsString()
    property: string;

    @IsString()
    effect: string;

    dangerPills: DangerPill[]
}

export class DangerPill {
    @IsString()
    pillName: string;

    @IsString()
    reason: string;
}

export class AddRealNameToPillCahnnelDataReqDto {
    @IsString()
    cid: string;

    @IsString()
    rid: string;
}

export class PillChannelDetailDto extends PillChannelDataResDto {
    realPillData: RealPillDataDto;
}

export class AddLogHistoryReqDto {
    @IsString()
    lineUID: string;

    @IsString()
    channelId: string;

    @IsString()
    task: string;
}

export class HomeChannelData {
    @IsString()
    channelId: string;

    @IsString()
    pillName: string;
}

export class HomeChannelDataResDto {
    pillChannelDatas: HomeChannelData[]
}

export class GetPillChannelDetailReqDto {
    @IsString()
    lineUID: string;

    @IsString()
    channelId: string;
}

export class GetRealPillNameByKeywordResDto {
    realPillDatas: RealPillDataDto[]
}

export class GetHistoryReqDto {
    @IsString()
    filterBy: string;

    @IsString()
    lineUID: string;
}

export class HistoryDto {
    @IsString()
    time: string;

    @IsString()
    date: string;

    @IsDate()
    dateTime: Date;

    @IsString()
    task: string;
}

export class GetHistoryResDto {
    histories: HistoryDto[]
}