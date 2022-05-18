import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { taskList } from './constants/pill-data.constants';
import {
  IAddLogHistoryReq,
  IAddPillChannelDataReq,
  IAddRealNameToPillCahnnelDataReq,
  IDangerPill,
  IGetForgottenRateReq,
  IGetForgottenRateRes,
  IGetHistoryReq,
  IGetHistoryRes,
  IGetPillChannelDetailReq,
  IGetRealPillNameByKeywordRes,
  IHomeChannelDataRes,
  IPillChannelDataRes,
  IPillChannelDetail,
  IPillDataService,
  IPillStocksRes,
  IRealPillData,
} from './interfaces/pill-data.service.interfaces';
import {
  CidRidEntity,
  DangerPillEntity,
  ISaveDangerPill,
  ISaveLogHistory,
  ISavePillChannelData,
  ISaveRealPill,
  ISaveTakeTime,
  LogHistoryEntity,
  PillChannelDataEntity,
  RealPillEntity,
  TakeTimeEntity,
} from './models';

@Injectable()
export class PillDataService implements IPillDataService {
  constructor(
    @InjectRepository(PillChannelDataEntity)
    private readonly pillChannelDataRepository: Repository<PillChannelDataEntity>,

    @InjectRepository(TakeTimeEntity)
    private readonly takeTimeRepository: Repository<TakeTimeEntity>,

    @InjectRepository(RealPillEntity)
    private readonly realPillRepository: Repository<RealPillEntity>,

    @InjectRepository(DangerPillEntity)
    private readonly dangerPillRepository: Repository<DangerPillEntity>,

    @InjectRepository(CidRidEntity)
    private readonly cidRidRepository: Repository<CidRidEntity>,

    @InjectRepository(LogHistoryEntity)
    private readonly logHistoryRepository: Repository<LogHistoryEntity>,
  ) {}

  async addPillChannelData(
    req: IAddPillChannelDataReq,
  ): Promise<IPillChannelDataRes> {
    try {
      const savePillChannelData: ISavePillChannelData = {
        channelID: req.channelID,
        pillName: req.pillName,
        stock: req.stock,
        total: req.total,
        lineUID: req.lineUID,
      };

      const pillChannelData = await this.pillChannelDataRepository.save(
        savePillChannelData,
      );

      const timesToTakePill = await Promise.all(
        req.takeTimes.map(async (time) => {
          const saveTakeTime: ISaveTakeTime = {
            cid: pillChannelData.cid,
            time,
          };

          const takeTimeData = await this.takeTimeRepository.save(saveTakeTime);

          return takeTimeData.time;
        }),
      );

      return {
        channelID: pillChannelData.channelID,
        cid: pillChannelData.cid,
        createdAt: pillChannelData.createdAt,
        pillName: pillChannelData.pillName,
        stock: pillChannelData.stock,
        takeTimes: timesToTakePill,
        total: pillChannelData.total,
      };
    } catch (error) {
      console.log(error);
      throw new BadGatewayException(error);
    }
  }

  async addRealPillData(req: IRealPillData): Promise<IRealPillData> {
    try {
      const saveRealPillData: ISaveRealPill = {
        pillName: req.pillName,
        property: req.property,
        effect: req.effect,
      };
      const realPillData = await this.realPillRepository.save(saveRealPillData);

      const dangerPillData = await Promise.all(
        req.dangerPills.map(async (pill) => {
          const saveDangerPillData: ISaveDangerPill = {
            pillName: pill.pillName,
            reason: pill.reason,
            rid: realPillData.rid,
          };
          return await this.dangerPillRepository.save(saveDangerPillData);
        }),
      );

      const resRealPillData: IRealPillData = {
        pillName: realPillData.pillName,
        property: realPillData.property,
        effect: realPillData.effect,
        dangerPills: dangerPillData,
      };

      return resRealPillData;
    } catch (error) {
      console.log(error);
      throw new BadGatewayException(error);
    }
  }

  async addRealNameToPillChannelData(
    req: IAddRealNameToPillCahnnelDataReq,
  ): Promise<IPillChannelDetail> {
    try {
      const queryAddCidRid = this.cidRidRepository.save(req);
      const queryGetPillChannelData = this.pillChannelDataRepository.findOne({
        where: {
          cid: req.cid,
        },
      });
      const queryGetTakeTimesData = this.takeTimeRepository.find({
        where: { cid: req.cid },
      });
      const queryGetRealPillData = this.realPillRepository.findOne({
        where: {
          rid: req.rid,
        },
      });
      const queryGetDangerPillData = this.dangerPillRepository.find({
        where: { rid: req.rid },
      });

      const [
        cidRidQueryResData,
        pillChannelQueryResData,
        takeTimeQueryResData,
        realPillQueryResData,
        dangerPillQueryResData,
      ] = await Promise.all([
        queryAddCidRid,
        queryGetPillChannelData,
        queryGetTakeTimesData,
        queryGetRealPillData,
        queryGetDangerPillData,
      ]);

      const realPillData: IRealPillData = {
        pillName: realPillQueryResData.pillName,
        property: realPillQueryResData.property,
        effect: realPillQueryResData.effect,
        dangerPills: dangerPillQueryResData.map((obj): IDangerPill => {
          return {
            pillName: obj.pillName,
            reason: obj.reason,
          };
        }),
      };

      const res: IPillChannelDetail = {
        cid: pillChannelQueryResData.cid,
        channelID: pillChannelQueryResData.channelID,
        createdAt: pillChannelQueryResData.createdAt,
        pillName: pillChannelQueryResData.pillName,
        stock: pillChannelQueryResData.stock,
        total: pillChannelQueryResData.total,
        takeTimes: takeTimeQueryResData.map((obj) => obj.time),
        realPillData: realPillData,
      };

      return res;
    } catch (error) {
      console.log(error);
      throw new BadGatewayException(error);
    }
  }

  async addLogHistory(req: IAddLogHistoryReq): Promise<void> {
    try {
      if (taskList.includes(req.task)) {
        const pillChannelData = await this.pillChannelDataRepository.findOne({
          where: [{ channelID: req.channelID }, { lineUID: req.lineUID }],
        });
        const saveLogHistoryData: ISaveLogHistory = {
          cid: pillChannelData.cid,
          lineUID: req.lineUID,
          task: req.task,
        };

        await this.logHistoryRepository.save(saveLogHistoryData);
      } else {
        throw new BadGatewayException('Task not matches');
      }
    } catch (error) {
      console.log(error);
      throw new BadGatewayException(error);
    }
  }

  async getHomeChannelData(lineUID: string ): Promise<IHomeChannelDataRes> {
    try {
        const pillChannelDatas = await this.pillChannelDataRepository.find({where: {lineUID: lineUID}})
        return {
            pillChannelDatas: pillChannelDatas.map(pill => {
                return {
                    channelID: pill.channelID,
                    pillName: pill.pillName
                }
            })
        }
    } catch (error) {
        console.log(error);
        throw new BadGatewayException(error);
    }
  }

  async getPillChannelDetail(
    req: IGetPillChannelDetailReq,
  ): Promise<IPillChannelDetail> {
    try {
        const pillChannelDatas = await this.pillChannelDataRepository.findOne({where: {lineUID: req.lineUID, channelID: req.channelID}})

        if(!pillChannelDatas) return null;

        const cidRidData = await this.cidRidRepository.findOne({where: {cid: pillChannelDatas.cid}})
        const takeTimesData = await this.takeTimeRepository.find({
            where: { cid: pillChannelDatas.cid },
          });
        let realPillData: IRealPillData = null;
        if(cidRidData) {
            const queryGetRealPillData = this.realPillRepository.findOne({
                where: {
                  rid: cidRidData.rid,
                },
              });
              const queryGetDangerPillData = this.dangerPillRepository.find({
                where: { rid: cidRidData.rid },
              });
            const [
                realPillQueryResData,
                dangerPillQueryResData,
              ] = await Promise.all([
                queryGetRealPillData,
                queryGetDangerPillData,
              ]);
            realPillData = {
                pillName: realPillQueryResData.pillName,
                property: realPillQueryResData.property,
                effect: realPillQueryResData.effect,
                dangerPills: dangerPillQueryResData
            }
        }

        return {
            channelID: pillChannelDatas.channelID,
            cid: pillChannelDatas.cid,
            createdAt: pillChannelDatas.createdAt,
            pillName: pillChannelDatas.pillName,
            stock: pillChannelDatas.stock,
            total: pillChannelDatas.total,
            takeTimes: takeTimesData.map((obj) => obj.time),
            realPillData: realPillData,
        }

    } catch (error) {
        console.log(error);
        throw new BadGatewayException(error);
    }
  }

  async getRealPillNameByKeyword(
    keyword: string,
  ): Promise<IGetRealPillNameByKeywordRes> {
    throw new Error('Method not implemented.');
  }

  async getHistory(req: IGetHistoryReq): Promise<IGetHistoryRes> {
    throw new Error('Method not implemented.');
  }

  async getForgottenRate(
    req: IGetForgottenRateReq,
  ): Promise<IGetForgottenRateRes> {
    throw new Error('Method not implemented.');
  }

  async getPillStock( lineUID: string ): Promise<IPillStocksRes> {
    throw new Error('Method not implemented.');
  }
}
