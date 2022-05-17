import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { GetCurrentUserLineUID } from 'src/common/decorators';
import { AddPillChannelDataBodyDto, DangerPillBodyDto, PillChannelDataResDto, RealPillBodyDto, RealPillResDto } from './dto/pill-data.dto';
import { IAddPillChannelDataReq, IRealPillData } from './interfaces/pill-data.service.interfaces';
import { PillDataService } from './pill-data.service';

@Controller('pill-data')
export class PillDataController {
    constructor(private pillDataService: PillDataService) {}

    @Post('addPillChannelData')
    async addPillChannelData(
        @GetCurrentUserLineUID() lineUID: string,
        @Body() body: AddPillChannelDataBodyDto,
        
    ): Promise<PillChannelDataResDto> {
        const req: IAddPillChannelDataReq = {
            channelID: body.channelID,
            pillName: body.pillName,
            stock: body.stock,
            takeTimes: body.takeTimes,
            total: body.total,
            lineUID,
        }

        const pillChannelData = await this.pillDataService.addPillChannelData(req)
        return new PillChannelDataResDto(pillChannelData)
    }

    @Post('addRealPillData')
    async addRealPillData(
        @Body() body: RealPillBodyDto,
        @Body('danger_pills') dangerPills: Array<any>
    ): Promise<RealPillResDto> {
        const req: IRealPillData = {
            dangerPills: dangerPills.map(pill => {
                return {
                    pillName: pill['pill_name'],
                    reason: pill['reason']
                }
            }),
            effect: body.effect,
            pillName: body.pillName,
            property: body.property
        }

        const realPillData = await this.pillDataService.addRealPillData(req)

        return new RealPillResDto(realPillData)
    }
}
