import { Column, Entity } from 'typeorm';
import { BaseIndicatorEntity } from './base-indicator.entity';
import { IndicatorType } from '../../../../../../utils/type/type-definition';

@Entity({ name: 'stocks' })
export class StockEntity extends BaseIndicatorEntity {
  @Column({ default: 'stocks' })
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

  @Column()
  type: string;
}
