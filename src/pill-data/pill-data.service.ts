import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAddLogHistoryReq, IAddRealNameToPillCahnnelDataReq, IGetForgottenRateReq, IGetForgottenRateRes, IGetHistoryReq, IGetHistoryRes, IGetPillChannelDetailReq, IGetRealPillNameByKeywordRes, IHomeChannelDataRes, IPillChannelDetail, IPillDataService, IPillStocksRes, IRealPillData } from './interfaces/pill-data.service.interfaces';
import { AddPillChannelDataReqDto, PillChannelDataResDto } from './dto/pill-data.dto';
import { ISavePillChannelData, ISaveTakeTime, PillChannelDataEntity, TakeTimeEntity } from './models';

@Injectable()
export class PillDataService implements IPillDataService {
    constructor(
        @InjectRepository(PillChannelDataEntity)
        private readonly pillChannelDataRepository: Repository<PillChannelDataEntity>,

        @InjectRepository(TakeTimeEntity)
        private readonly takeTimeRepository: Repository<TakeTimeEntity>
    ){}

    async addPillChannelData(req: AddPillChannelDataReqDto): Promise<PillChannelDataResDto> {

        const {
            channelId,
            pillName,
            stock,
            takeTimes,
            lineUID,
            total
        } = req
        try {
            const savePillChannelData: ISavePillChannelData = {
                channelId,
                pillName,
                stock,
                lineUID,
                total
            }

            const pillChannelData = await this.pillChannelDataRepository.save(savePillChannelData)

            const timesToTakePill = await Promise.all(
                takeTimes.map(async (time) => {
                    const saveTakeTime: ISaveTakeTime = {
                        cid: pillChannelData.cid,
                        time
                    }

                    const takeTimeData = await this.takeTimeRepository.save(saveTakeTime)

                    return takeTimeData.time
                })
            )

            return {
                channelId: pillChannelData.channelId,
                cid: pillChannelData.cid,
                createdAt: pillChannelData.createdAt,
                pillName: pillChannelData.pillName,
                stock: pillChannelData.stock,
                takeTimes: timesToTakePill,
                total: pillChannelData.total
            }
            
        } catch (error) {
            throw new BadGatewayException(error)
        }
    }
    
    addRealPillData(req: IRealPillData): Promise<IRealPillData> {
        throw new Error('Method not implemented.');
    }
    
    addRealNameToPillChannelData(req: IAddRealNameToPillCahnnelDataReq): Promise<IPillChannelDetail> {
        throw new Error('Method not implemented.');
    }
    
    addLogHistory(req: IAddLogHistoryReq): Promise<void> {
        throw new Error('Method not implemented.');
    }
    
    getHomeChannelData({ lineUID: string }: { lineUID: any; }): Promise<IHomeChannelDataRes> {
        throw new Error('Method not implemented.');
    }
    
    getPillChannelDetail(req: IGetPillChannelDetailReq): Promise<IPillChannelDetail> {
        throw new Error('Method not implemented.');
    }
    
    getRealPillNameByKeyword({ keyword: string }: { keyword: any; }): Promise<IGetRealPillNameByKeywordRes> {
        throw new Error('Method not implemented.');
    }
    
    getHistory(req: IGetHistoryReq): Promise<IGetHistoryRes> {
        throw new Error('Method not implemented.');
    }
    
    getForgottenRate(req: IGetForgottenRateReq): Promise<IGetForgottenRateRes> {
        throw new Error('Method not implemented.');
    }
    
    getPillStock({ lineUID: string }: { lineUID: any; }): Promise<IPillStocksRes> {
        throw new Error('Method not implemented.');
    }
    
    
    
}
