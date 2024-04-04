import { Column, Entity } from 'typeorm';
import { BaseIndicatorEntity } from './base-indicator.entity';

@Entity({ name: 'ETF' })
export class ETFEntity extends BaseIndicatorEntity {
  @Column()
  name: string;

  @Column()
  currency: string;

  @Column()
  exchange: string;

  @Column()
  mic_code: string;

  @Column()
  country: string;
}
