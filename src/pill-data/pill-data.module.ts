import { Module } from '@nestjs/common';
import { PillDataService } from './pill-data.service';
import { PillDataController } from './pill-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CidRidEntity, DangerPillEntity, LogHistoryEntity, PillChannelDataEntity, RealPillEntity, TakeTimeEntity } from './models/pill-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    PillChannelDataEntity,
    TakeTimeEntity,
    CidRidEntity,
    RealPillEntity,
    DangerPillEntity,
    LogHistoryEntity,
  ])],
  providers: [PillDataService],
  controllers: [PillDataController]
})
export class PillDataModule {}
