import { Column, Entity } from 'typeorm';
import { BaseIndicatorEntity } from './base-indicator.entity';
import { IndicatorType } from '../../../../../../utils/type/type-definition';

@Entity({ name: 'etf' })
export class ETFEntity extends BaseIndicatorEntity {
  @Column({ default: 'etf' })
  indicatorType: IndicatorType;

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
