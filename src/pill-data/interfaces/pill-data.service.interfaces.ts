export interface IPillDataService {
  addPillChannelData(req: IAddPillChannelDataReq): Promise<IPillChannelDataRes>;
  addRealPillData(req: IRealPillData): Promise<IRealPillData>;
  addRealNameToPillChannelData(
    req: IAddRealNameToPillCahnnelDataReq,
  ): Promise<IPillChannelDetail>;
  deleteRealNameInPillChannelData(
    req: IAddRealNameToPillCahnnelDataReq,
  ): Promise<void>;
  addLogHistory(req: IAddLogHistoryReq): Promise<void>;
  getHomeChannelData(lineUID: string): Promise<IHomeChannelDataRes>;
  getPillChannelDetail(
    req: IGetPillChannelDetailReq,
  ): Promise<IPillChannelDetail>;
  getRealPillNameByKeyword(
    keyword: string,
  ): Promise<IGetRealPillNameByKeywordRes>;
  getHistory(req: IGetHistoryReq): Promise<IGetHistoryRes>;
  getForgottenRate(req: IGetForgottenRateReq): Promise<IGetForgottenRateRes>;
  getPillStock(lineUID: string): Promise<IPillStocksRes>;
  getHardwarePillChannelDatas(lineUID: string): Promise<IPillChannelDetail[]>;
  deletePillChannelData(req: IDeletePIllChannelDataReq): Promise<void>;
}

export interface IDeletePIllChannelDataReq {
  lineUID: string;
  channelID: string;
}

export interface IAddPillChannelDataReq {
  lineUID: string;
  channelID: string;
  pillName: string;
  pillsPerTime: number;
  total?: number;
  stock: number;
  takeTimes: string[];
}

export interface IPillChannelDataRes {
  cid: string;
  channelID: string;
  pillName: string;
  pillsPerTime: number;
  total?: number;
  stock: number;
  takeTimes: string[];
  createdAt: Date;
}

export interface IRealPillData {
  rid?: string;
  pillName: string;
  property: string;
  effect: string;
  dangerPills?: IDangerPill[];
}

export interface IDangerPill {
  pillName: string;
  reason: string;
}

export interface IAddRealNameToPillCahnnelDataReq {
  cid: string;
  rid: string;
}

export interface IPillChannelDetail extends IPillChannelDataRes {
  realPillData: IRealPillData;
}

export interface IAddLogHistoryReq {
  lineUID: string;
  channelID: string;
  task: string;
}

export interface IHomeChannelData {
  channelID: string;
  pillName: string;
}

export interface IHomeChannelDataRes {
  pillChannelDatas: IHomeChannelData[];
}

export interface IGetPillChannelDetailReq {
  lineUID: string;
  channelID: string;
}

export interface IGetRealPillNameByKeywordRes {
  realPillDatas: IRealPillData[];
}

export interface IGetHistoryReq {
  filterBy: string;
  lineUID: string;
}

export interface IHistory {
  dateTime: Date;
  task: string;
  pillName: string;
}

export interface IGetHistoryRes {
  histories: IHistory[];
  start_date: string;
  end_date: string;
}

export interface IGetForgottenRateReq {
  filterBy: string;
  lineUID: string;
}

export interface IGetForgottenRateRes {
  rates: number[];
  start_date: string;
  end_date: string;
}

export interface IPillStocksRes {
  pillStocks: IPillChannelDataRes[];
}
