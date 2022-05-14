import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPillDataService } from './interfaces/pill-data.service.interfaces';
import { AddPillChannelDataReqDto, AddPillChannelDataResDto } from './dto/pill-data.dto';
import { PillChannelDataEntity, TakeTimeEntity } from './models/pill-data.entity';
import { ISavePillChannelData, ISaveTakeTime } from './models/pill-data.entity.interfaces';

@Injectable()
export class PillDataService implements IPillDataService {
    constructor(
        @InjectRepository(PillChannelDataEntity)
        private readonly pillChannelDataRepository: Repository<PillChannelDataEntity>,

        @InjectRepository(TakeTimeEntity)
        private readonly takeTimeRepository: Repository<TakeTimeEntity>
    ){}
    
    async addPillChannelData(req: AddPillChannelDataReqDto): Promise<AddPillChannelDataResDto> {

        const {
            channelId,
            pillName,
            stock,
            takeTimes,
            uid,
            total
        } = req
        try {
            const savePillChannelData: ISavePillChannelData = {
                channelId,
                pillName,
                stock,
                uid,
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
}
