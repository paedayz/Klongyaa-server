import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import {
  getHistoryFilterByList,
  taskList,
} from './constants/pill-data.constants';
import {
  IAddLogHistoryReq,
  IAddPillChannelDataReq,
  IAddRealNameToPillCahnnelDataReq,
  IDangerPill,
  IDeletePIllChannelDataReq,
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
        pillsPerTime: req.pillsPerTime,
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
        pillsPerTime: pillChannelData.pillsPerTime,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
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
        rid: realPillData.rid,
        pillName: realPillData.pillName,
        property: realPillData.property,
        effect: realPillData.effect,
        dangerPills: dangerPillData,
      };

      return resRealPillData;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async addRealNameToPillChannelData(
    req: IAddRealNameToPillCahnnelDataReq,
  ): Promise<IPillChannelDetail> {
    try {
      const findChannelWithRealPillData = await this.cidRidRepository.findOne({
        where: { cid: req.cid },
      });
      
      if (findChannelWithRealPillData) {
        await this.cidRidRepository.update({ cid: req.cid }, { rid: req.rid });
      } else {
        await this.cidRidRepository.save(req);
      }

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
        pillChannelQueryResData,
        takeTimeQueryResData,
        realPillQueryResData,
        dangerPillQueryResData,
      ] = await Promise.all([
        queryGetPillChannelData,
        queryGetTakeTimesData,
        queryGetRealPillData,
        queryGetDangerPillData,
      ]);

      const realPillData: IRealPillData = {
        rid: realPillQueryResData.rid,
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
        pillsPerTime: pillChannelQueryResData.pillsPerTime,
      };

      return res;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async addLogHistory(req: IAddLogHistoryReq): Promise<void> {
    try {
      if (taskList.includes(req.task)) {
        const pillChannelData = await this.pillChannelDataRepository.findOne({
          where: [{ channelID: req.channelID, lineUID: req.lineUID }],
        });
        const saveLogHistoryData: ISaveLogHistory = {
          pillName: pillChannelData.pillName,
          lineUID: req.lineUID,
          task: req.task,
        };

        await this.logHistoryRepository.save(saveLogHistoryData);
      } else {
        throw new BadRequestException('Task not matches');
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async getHomeChannelData(lineUID: string): Promise<IHomeChannelDataRes> {
    try {
      const pillChannelDatas = await this.pillChannelDataRepository.find({
        where: { lineUID: lineUID },
      });
      return {
        pillChannelDatas: pillChannelDatas.map((pill) => {
          return {
            channelID: pill.channelID,
            pillName: pill.pillName,
          };
        }),
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async getPillChannelDetail(
    req: IGetPillChannelDetailReq,
  ): Promise<IPillChannelDetail> {
    try {
      const pillChannelDatas = await this.pillChannelDataRepository.findOne({
        where: { lineUID: req.lineUID, channelID: req.channelID },
      });

      if (!pillChannelDatas) return null;

      const cidRidData = await this.cidRidRepository.findOne({
        where: { cid: pillChannelDatas.cid },
      });
      const takeTimesData = await this.takeTimeRepository.find({
        where: { cid: pillChannelDatas.cid },
      });
      let realPillData: IRealPillData = null;
      if (cidRidData) {
        const queryGetRealPillData = this.realPillRepository.findOne({
          where: {
            rid: cidRidData.rid,
          },
        });
        const queryGetDangerPillData = this.dangerPillRepository.find({
          where: { rid: cidRidData.rid },
        });
        const [realPillQueryResData, dangerPillQueryResData] =
          await Promise.all([queryGetRealPillData, queryGetDangerPillData]);
        realPillData = {
          pillName: realPillQueryResData.pillName,
          property: realPillQueryResData.property,
          effect: realPillQueryResData.effect,
          dangerPills: dangerPillQueryResData,
          rid: realPillQueryResData.rid
        };
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
        pillsPerTime: pillChannelDatas.pillsPerTime
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async getRealPillNameByKeyword(
    keyword: string,
  ): Promise<IGetRealPillNameByKeywordRes> {
    try {
      const realPills = await this.realPillRepository
        .createQueryBuilder()
        .where('LOWER(RealPillEntity.pillName) LIKE :pillName', {
          pillName: `%${keyword.toLowerCase()}%`,
        })
        .getMany();
      const realPillDatas: IRealPillData[] = await Promise.all(
        realPills.map(async (pill): Promise<IRealPillData> => {
          const dangerPills = await this.dangerPillRepository.find({
            where: { rid: pill.rid },
          });
          return {
            pillName: pill.pillName,
            property: pill.property,
            effect: pill.effect,
            dangerPills,
            rid: pill.rid
          };
        }),
      );
      return {
        realPillDatas,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async getHistory(req: IGetHistoryReq): Promise<IGetHistoryRes> {
    try {
      if (!getHistoryFilterByList.includes(req.filterBy))
        throw new BadRequestException('Filter not matches');
      var curr = new Date(); // get current date
      var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      var last = first + 6; // last day is the first day + 6

      var firstday = new Date(curr.setDate(first)).toDateString();
      var lastday = new Date(curr.setDate(last)).toDateString();
      console.log(firstday);
      console.log(lastday)
      const logHistoryDatas = await this.logHistoryRepository
        .createQueryBuilder()
        .where('LogHistoryEntity.createdAt BETWEEN :begin AND :end', {
          begin: firstday,
          end: lastday,
        })
        .getMany();
 
      return null
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async getForgottenRate(
    req: IGetForgottenRateReq,
  ): Promise<IGetForgottenRateRes> {
    throw new Error('Method not implemented.');
  }

  async getPillStock(lineUID: string): Promise<IPillStocksRes> {
    try {
      const pillChannelDatas = await this.pillChannelDataRepository.find({
        where: {
          lineUID
        },
      });

      const pillStocks: IPillStocksRes = {
         pillStocks: await Promise.all(pillChannelDatas.map(async(pill): Promise<IPillChannelDataRes> => {
          const takeTimes = await this.takeTimeRepository.find({where: {cid: pill.cid}})
          return {
            channelID: pill.channelID,
            cid: pill.cid,
            createdAt: pill.createdAt,
            pillName: pill.pillName,
            stock: pill.stock,
            total: pill.total,
            takeTimes: takeTimes.map(time => time.time),
            pillsPerTime: pill.pillsPerTime
          }
         }))
      }

      return pillStocks
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async getHardwarePillChannelDatas(lineUID: string): Promise<IPillChannelDetail[]> {
    try {
      const pillChannelDatas = await this.pillChannelDataRepository.find({
        where: { lineUID: lineUID },
      })

      return await Promise.all(pillChannelDatas.map(async(pill) => {
        const pillDetail = await this.getPillChannelDetail({lineUID, channelID: pill.channelID})
        return pillDetail
      }))
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async deletePillChannelData(req: IDeletePIllChannelDataReq): Promise<void> {
    try {
      const pillChannelData = await this.pillChannelDataRepository.findOne({where: {channelID: req.channelID, lineUID: req.lineUID}})
      const queryDeletePillChannelData = this.pillChannelDataRepository.delete({cid: pillChannelData.cid})
      const queryDeleteTakeTimes = this.takeTimeRepository.delete({cid: pillChannelData.cid})
      const queryDeleteCidRid = this.cidRidRepository.delete({cid: pillChannelData.cid})

      await Promise.all([
        queryDeleteCidRid, queryDeletePillChannelData, queryDeleteTakeTimes
      ])

    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}
