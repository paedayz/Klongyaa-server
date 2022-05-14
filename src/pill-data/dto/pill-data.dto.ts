import { IsDate, IsString } from "class-validator";

export class AddPillChannelDataReqDto {
    @IsString()
    uid: string;

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

export class AddPillChannelDataResDto {
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