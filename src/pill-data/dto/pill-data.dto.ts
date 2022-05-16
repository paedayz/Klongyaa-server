import { IsDate, IsString } from "class-validator";

export class AddPillChannelDataReqDto {
    @IsString()
    lineUID: string;

    @IsString()
    channelId: string;

    @IsString()
    pillName: string;

    @IsString()
    total?: number;

    @IsString()
    stock: number;

    @IsString({each: true})
    takeTimes: string[]
}

export class PillChannelDataResDto {
    @IsString()
    cid: string;

    @IsString()
    channelId: string;

    @IsString()
    pillName: string;

    @IsString()
    total?: number;

    @IsString()
    stock: number;

    @IsString({each: true})
    takeTimes: string[]

    @IsDate()
    createdAt: Date
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