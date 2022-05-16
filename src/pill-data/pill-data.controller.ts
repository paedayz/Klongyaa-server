import { Body, Controller, Post } from '@nestjs/common';
import { GetCurrentUserLineUID } from 'src/common/decorators';
import { AddPillChannelDataReqDto, PillChannelDataResDto } from './dto/pill-data.dto';
import { PillDataService } from './pill-data.service';

@Controller('pill-data')
export class PillDataController {
    constructor(private pillDataService: PillDataService) {}

    @Post('addPillChannelData')
    async addPillChannelData(
        @GetCurrentUserLineUID() lineUID: string,
        @Body('channelId') channelId: string,
        @Body('pillName') pillName: string,
        @Body('total') total: number,
        @Body('stock') stock: number,
        @Body('takeTimes') takeTimes: string[]
        
    ): Promise<PillChannelDataResDto> {
        const req: AddPillChannelDataReqDto = {
            channelId,
            pillName,
            stock,
            takeTimes,
            lineUID,
            total
        }
        return await this.pillDataService.addPillChannelData(req)
    }
}
