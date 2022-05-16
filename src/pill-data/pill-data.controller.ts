import { Body, Controller, Post } from '@nestjs/common';
import { GetCurrentUserLineUID } from 'src/common/decorators';
import { AddPillChannelDataBodyDto, PillChannelDataResDto } from './dto/pill-data.dto';
import { IAddPillChannelDataReq } from './interfaces/pill-data.service.interfaces';
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
}
