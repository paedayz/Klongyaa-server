import { Expose } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";
import { IPillChannelDataRes, IPillChannelDetail, IRealPillData } from "../interfaces/pill-data.service.interfaces";

export class AddPillChannelDataBodyDto {
    @IsString()
    @Expose({name: 'channel_id'})
    channelID: string;

    @IsString()
    @Expose({name: 'pill_name'})
    pillName: string;

    // @IsNumber({allowNaN: true})
    @Expose({name: 'total'})
    total?: number;

    @IsNumber()
    @Expose({name: 'stock'})
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
    @Expose({name: 'cid'})
    cid: string;

    @IsString()
    @Expose({name: 'channelID'})
    channel_id: string;

    @IsString()
    @Expose({name: 'pillName'})
    pill_name: string;

    @IsString()
    @Expose({name: 'total'})
    total?: number;

    @IsString()
    @Expose({name: 'stock'})
    stock: number;

    @IsString({each: true})
    @Expose({name: 'takeTimes'})
    take_times: string[]

    @IsDate()
    @Expose({name: 'createdAt'})
    created_at: Date
}

export class RealPillBodyDto {
    @Expose({name: 'pill_name'})
    pillName: string;

    @IsString()
    @Expose({name: 'property'})
    property: string;

    @IsString()
    @Expose({name: 'effect'})
    effect: string;

    @Expose({name: 'danger_pills'})
    dangerPills?: DangerPillBodyDto[]
}

export class DangerPillBodyDto {
    constructor(obj) {
        this.pillName = obj['pill_name'];
        this.reason = obj['reason']
    }
    @Expose({name: 'pill_name'})
    pillName: string;

    @Expose({name: 'reason'})
    reason: string;
}

export class RealPillResDto {
    constructor(obj: IRealPillData){
        this.pill_name = obj.pillName;
        this.property = obj.property;
        this.effect = obj.effect;
        this.danger_pills = obj.dangerPills.map(dp => {
            return {
                pill_name: dp.pillName,
                reason: dp.reason
            }
        })
    }
    @IsString()
    pill_name: string;

    @IsString()
    property: string;

    @IsString()
    effect: string;

    danger_pills: DangerPillResDto[]
}

export class DangerPillResDto {
    @IsString()
    pill_name: string;

    @IsString()
    reason: string;
}

export class AddRealNameToPillCahnnelDataReqDto {
    @IsString()
    @Expose({name: 'cid'})
    cid: string;

    @IsString()
    @Expose({name: 'rid'})
    rid: string;
}

export class PillChannelDetailResDto extends PillChannelDataResDto {
    constructor(obj: IPillChannelDetail) {
        super(obj);
        this.real_pill_data = new RealPillResDto(obj.realPillData)
    }
    @Expose({name: 'realPillData'})
    real_pill_data: RealPillResDto;
}

export class AddLogHistoryBodyDto {
    @IsString()
    @Expose({name: 'channel_id'})
    channelID: string;

    @IsString()
    @Expose({name: 'task'})
    task: string;
}

export class HomeChannelData {
    @IsString()
    @Expose({name: 'channelID'})
    channel_id: string;

    @IsString()
    @Expose({name: 'pillName'})
    pill_name: string;
}

export class HomeChannelDataResDto {
    @Expose({name: 'pillChannelDatas'})
    pill_channel_datas: HomeChannelData[]
}

export class GetPillChannelDetailReqDto {
    @IsString()
    @Expose({name: 'line_uid'})
    lineUID: string;

    @IsString()
    @Expose({name: 'channel_id'})
    channelID: string;
}

export class GetRealPillNameByKeywordResDto {
    @Expose({name: 'realPillDatas'})
    real_pill_datas: RealPillResDto[]
}

export class GetHistoryReqDto {
    @IsString()
    @Expose({name: 'filter_by'})
    filterBy: string;

    @IsString()
    @Expose({name: 'line_uid'})
    lineUID: string;
}

export class HistoryDto {
    @IsString()
    @Expose({name: 'time'})
    time: string;

    @IsString()
    @Expose({name: 'date'})
    date: string;

    @IsDate()
    @Expose({name: 'date_time'})
    dateTime: Date;

    @IsString()
    @Expose({name: 'task'})
    task: string;
}

export class GetHistoryResDto {
    @Expose({name: 'histories'})
    histories: HistoryDto[]
}