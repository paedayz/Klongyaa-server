import { Body, Controller, Post } from '@nestjs/common';
import { AddPillChannelDataReqDto, AddPillChannelDataResDto } from './dto/pill-data.dto';
import { PillDataService } from './pill-data.service';

@Controller('pill-data')
export class PillDataController {
    constructor(private pillDataService: PillDataService) {}

    @Post('addPillChannelData')
    async addPillChannelData(
        @Body('uid') uid: string,
        @Body('channelId') channelId: string,
        @Body('pillName') pillName: string,
        @Body('total') total: number,
        @Body('stock') stock: number,
        @Body('takeTimes') takeTimes: string[]
        
    ): Promise<AddPillChannelDataResDto> {
        const req: AddPillChannelDataReqDto = {
            channelId,
            pillName,
            stock,
            takeTimes,
            uid,
            total
        }
        return await this.pillDataService.addPillChannelData(req)
    }
}
