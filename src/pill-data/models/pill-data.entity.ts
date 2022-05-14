import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pill_channel_data')
export class PillChannelDataEntity {
  @PrimaryGeneratedColumn('uuid')
  cid: string;

  @Column()
  uid: string;

  @Column()
  channelId: string;

  @Column()
  pillName: string;

  @Column({ default: 0 })
  total: number;

  @Column()
  stock: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

@Entity('take_time')
export class TakeTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  tid: string;

  @Column()
  cid: string;

  @Column()
  time: string;
}

@Entity('cid_rid')
export class CidRidEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cid: string;

  @Column()
  rid: string;
}

@Entity('real_pill')
export class RealPillEntity {
  @PrimaryGeneratedColumn('uuid')
  rid: string;

  @Column()
  pillName: string;

  @Column()
  properties: string;

  @Column()
  effect: string;
}

@Entity('danger_pill')
export class DangerPillEntity {
  @PrimaryGeneratedColumn('uuid')
  did: string;

  @Column()
  rid: string;

  @Column()
  pillName: string;

  @Column()
  reason: string;
}