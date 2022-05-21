import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import {
  getHistoryFilterByList,
  taskList,
  TXT_MONTH,
  TXT_TAKE_PILL,
  TXT_WEEK,
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

  async deleteRealNameInPillChannelData(req: IAddRealNameToPillCahnnelDataReq): Promise<void> {
    try {
      await this.cidRidRepository.delete({cid: req.cid, rid: req.rid})
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

        if(req.task === TXT_TAKE_PILL) {
          let total = pillChannelData.total - pillChannelData.pillsPerTime
          if(total < 0) total = 0;
          await this.pillChannelDataRepository.update({cid: pillChannelData.cid}, {total})
        }
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
          rid: realPillQueryResData.rid,
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
        pillsPerTime: pillChannelDatas.pillsPerTime,
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
            rid: pill.rid,
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

  private getFirstLastDay(filterBy: string): [string, string] {
    let firstday: string;
    let lastday: string;

    var curr = new Date();

    let first: Date;
    let last: Date;

    const month = curr.getMonth();
    const year = curr.getFullYear();
    const hour = curr.getHours();
    const min = curr.getMinutes();
    const sec = curr.getSeconds();

    const date_amount = new Date(year, month - 1, 0).getDate();

    if (filterBy === TXT_WEEK) {
      first = new Date(curr.getTime() - 6 * 24 * 60 * 60 * 1000);
      last = curr;
    } else if (filterBy === TXT_MONTH) {
      first = new Date(year, month, 1, hour, min, sec);
      last = new Date(year, month, date_amount, hour, min, sec);;
    } else {
      
      first = new Date(year, month - 1, 1, hour, min, sec);
      last = new Date(year, month - 1, date_amount, hour, min, sec);
    }

    firstday = first.toISOString();
    lastday = last.toISOString();

    return [firstday, lastday];
  }

  async getHistory(req: IGetHistoryReq): Promise<IGetHistoryRes> {
    try {
      if (!getHistoryFilterByList.includes(req.filterBy))
        throw new BadRequestException('Filter not matches');

      const [firstday, lastday] = this.getFirstLastDay(req.filterBy);

      const logHistoryDatas = await this.logHistoryRepository
        .createQueryBuilder()
        .where('LogHistoryEntity.createdAt BETWEEN :begin AND :end', {
          begin: firstday,
          end: lastday,
        })
        .getMany();

      return {
        histories: logHistoryDatas.map((log) => {
          return {
            dateTime: log.createdAt,
            pillName: log.pillName,
            task: log.task,
          };
        }),
        start_date: firstday,
        end_date: lastday,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async getForgottenRate(
    req: IGetForgottenRateReq,
  ): Promise<IGetForgottenRateRes> {
    try {
      const [firstday, lastday] = this.getFirstLastDay(req.filterBy);

      const histories = await this.logHistoryRepository
        .createQueryBuilder()
        .where('LogHistoryEntity.createdAt BETWEEN :begin AND :end', {
          begin: firstday,
          end: lastday,
        })
        .andWhere("LogHistoryEntity.task = 'Forgot to take pill' ")
        .getMany();

      let countArr = [];

      if (req.filterBy === TXT_WEEK) {
        const startDay = new Date(firstday).getDate();
        const endDay = new Date(lastday).getDate();

        for (let i = startDay; i <= endDay; i++) {
          let counter: number = 0;
          counter = histories.filter(
            (log) => new Date(log.createdAt).getDate() === i,
          ).length;
          countArr.push(counter);
        }
      } else if (req.filterBy === TXT_MONTH) {
        countArr = [0, 0, 0, 0];
        histories.map((log) => {
          let arrIndex = Math.floor(new Date(log.createdAt).getDate() / 7);
          countArr[arrIndex] = countArr[arrIndex] + 1;
        });
      }
      return {
        end_date: lastday,
        start_date: firstday,
        rates: countArr,
      };
    } catch (error) {}
  }

  async getPillStock(lineUID: string): Promise<IPillStocksRes> {
    try {
      const pillChannelDatas = await this.pillChannelDataRepository.find({
        where: {
          lineUID,
        },
      });

      const pillStocks: IPillStocksRes = {
        pillStocks: await Promise.all(
          pillChannelDatas.map(async (pill): Promise<IPillChannelDataRes> => {
            const takeTimes = await this.takeTimeRepository.find({
              where: { cid: pill.cid },
            });
            return {
              channelID: pill.channelID,
              cid: pill.cid,
              createdAt: pill.createdAt,
              pillName: pill.pillName,
              stock: pill.stock,
              total: pill.total,
              takeTimes: takeTimes.map((time) => time.time),
              pillsPerTime: pill.pillsPerTime,
            };
          }),
        ),
      };

      return pillStocks;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async getHardwarePillChannelDatas(
    lineUID: string,
  ): Promise<IPillChannelDetail[]> {
    try {
      const pillChannelDatas = await this.pillChannelDataRepository.find({
        where: { lineUID: lineUID },
      });

      return await Promise.all(
        pillChannelDatas.map(async (pill) => {
          const pillDetail = await this.getPillChannelDetail({
            lineUID,
            channelID: pill.channelID,
          });
          return pillDetail;
        }),
      );
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async deletePillChannelData(req: IDeletePIllChannelDataReq): Promise<void> {
    try {
      const pillChannelData = await this.pillChannelDataRepository.findOne({
        where: { channelID: req.channelID, lineUID: req.lineUID },
      });
      const queryDeletePillChannelData = this.pillChannelDataRepository.delete({
        cid: pillChannelData.cid,
      });
      const queryDeleteTakeTimes = this.takeTimeRepository.delete({
        cid: pillChannelData.cid,
      });
      const queryDeleteCidRid = this.cidRidRepository.delete({
        cid: pillChannelData.cid,
      });

      await Promise.all([
        queryDeleteCidRid,
        queryDeletePillChannelData,
        queryDeleteTakeTimes,
      ]);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}
