import { AddPillChannelDataReqDto, PillChannelDataResDto, AddRealNameToPillCahnnelDataReqDto, PillChannelDetailDto, RealPillDataDto, AddLogHistoryReqDto, GetPillChannelDetailReqDto, HomeChannelDataResDto, GetRealPillNameByKeywordResDto, GetHistoryReqDto, GetHistoryResDto } from "../dto/pill-data.dto";

export interface IPillDataService {
    addPillChannelData(req: AddPillChannelDataReqDto): Promise<PillChannelDataResDto>;
    addRealPillData(req: RealPillDataDto): Promise<RealPillDataDto>;
    addRealNameToPillChannelData(req: AddRealNameToPillCahnnelDataReqDto): Promise<PillChannelDetailDto>;
    addLogHistory(req: AddLogHistoryReqDto): Promise<void>;
    getHomeChannelData(line_uid: string): Promise<HomeChannelDataResDto>;
    getPillChannelDetail(req: GetPillChannelDetailReqDto): Promise<PillChannelDetailDto>;
    getRealPillNameByKeyword(keyword: string): Promise<GetRealPillNameByKeywordResDto>;
    getHistory(req: GetHistoryReqDto): Promise<GetHistoryResDto>;
    getForgottenRate();
    getPillStock();
}