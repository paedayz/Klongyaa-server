import { AddPillChannelDataReqDto, AddPillChannelDataResDto } from "../dto/pill-data.dto";

export interface IPillDataService {
    addPillChannelData(req: AddPillChannelDataReqDto): Promise<AddPillChannelDataResDto>;
}