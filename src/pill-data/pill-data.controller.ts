import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GetCurrentUserLineUID, Public } from 'src/common/decorators';
import { AddLogHistoryBodyDto, AddPillChannelDataBodyDto, AddRealNameToPillCahnnelDataReqDto, GetHardwarePillChannelDatasResDto, GetHistoryReqDto, GetHistoryResDto, GetPillChannelDetailReqDto, GetPillStockDto, GetRealPillNameByKeywordResDto, HomeChannelData, HomeChannelDataResDto, PillChannelDataResDto, PillChannelDetailResDto, RealPillBodyDto, RealPillResDto } from './dto/pill-data.dto';
import { IAddLogHistoryReq, IAddPillChannelDataReq, IAddRealNameToPillCahnnelDataReq, IRealPillData } from './interfaces/pill-data.service.interfaces';
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
            pillsPerTime: body.pillsPerTime,
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

    @Post('addRealNameToPillCahnnelDataReqDto')
    async addRealNameToPillCahnnelDataReqDto(@Body() body: AddRealNameToPillCahnnelDataReqDto) : Promise<PillChannelDetailResDto> {
        const req: IAddRealNameToPillCahnnelDataReq = {
            cid: body.cid,
            rid: body.rid
        }

        const res = await this.pillDataService.addRealNameToPillChannelData(req)

        return new PillChannelDetailResDto(res)
    }

    @Get('getHomeChannelData')
    async getHomeChannelData(@GetCurrentUserLineUID() lineUID: string): Promise<HomeChannelDataResDto> {
        const res = await this.pillDataService.getHomeChannelData(lineUID)
        return new HomeChannelDataResDto(res)
    }

    @Get('getPillChannelDetail/:channelID')
    async getPillChannelDetail(
        @Param('channelID') channelID: string,
        @GetCurrentUserLineUID() lineUID: string
        ): Promise<PillChannelDetailResDto> {
        const req: GetPillChannelDetailReqDto = {
            channelID,
            lineUID
        }
        const res = await this.pillDataService.getPillChannelDetail(req)
        return res? new PillChannelDetailResDto(res): null

    }

    @Get('getRealPillNameByKeyword/:keyword')
    async getRealPillNameByKeyword(
        @Param('keyword') keyword: string,
    ): Promise<GetRealPillNameByKeywordResDto> {
        const res = await this.pillDataService.getRealPillNameByKeyword(keyword)

        return new GetRealPillNameByKeywordResDto(res)
    }

    @Get('getHistory/:filterBy')
    async getHistory(
        @Param('filterBy') filterBy: string,
        @GetCurrentUserLineUID() lineUID: string
    ): Promise<GetHistoryResDto> {
        const req: GetHistoryReqDto = {
            filterBy,
            lineUID
        } 

        const res = await this.pillDataService.getHistory(req)

        return new GetHistoryResDto(res)
    }

    @Get('getPillStock')
    async getPillStock(@GetCurrentUserLineUID() lineUID: string): Promise<GetPillStockDto> {
        const res = await this.pillDataService.getPillStock(lineUID)
        return new GetPillStockDto(res)
    }

    @Public()
    @Get('getHardwarePillChannelDatas/:lineUID')
    async getHardwarePillChannelDatas(@Param('lineUID') lineUID: string): Promise<GetHardwarePillChannelDatasResDto> {
        const res = await this.pillDataService.getHardwarePillChannelDatas(lineUID)
        return new GetHardwarePillChannelDatasResDto(res)
    }

    @Public()
    @Post('deletePillChannelData')
    async deletePillChannelData(
        @Body('channelID') channelID: string,
        @Body('lineUID') lineUID: string,
    ): Promise<void> {
        return await this.pillDataService.deletePillChannelData({
            channelID,
            lineUID,
        })
    }

    @Public()
    @Post('addLogHistory')
    async addLogHistory(
        @Body() body: AddLogHistoryBodyDto
        ): Promise<void> {
        const req: IAddLogHistoryReq = {
            channelID: body.channelID,
            task: body.task,
            lineUID: body.lineUID
        }

        return await this.pillDataService.addLogHistory(req)
    }
}
