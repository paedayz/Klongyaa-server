import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PillDataModule } from './pill-data/pill-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // elephant postgres
      url: process.env.POSTGRES_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    PillDataModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
