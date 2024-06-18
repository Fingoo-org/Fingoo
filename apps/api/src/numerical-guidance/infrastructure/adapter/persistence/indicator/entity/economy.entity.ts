import { Column, Entity } from 'typeorm';
import { IndicatorType } from '../../../../../../utils/type/type-definition';
import { BaseIndicatorEntity } from './base-indicator.entity';

@Entity({ name: 'economy' })
export class EconomyEntity extends BaseIndicatorEntity {
  @Column({ default: 'economy' })
  indicatorType: IndicatorType;

  @Column()
  name: string;

  @Column()
  frequency: string;

  @Column()
  frequency_short: string;

  @Column()
  units: string;

  @Column()
  units_short: string;

  @Column()
  seasonal_adjustment: string;

  @Column()
  seasonal_adjustment_short: string;

  @Column()
  notes: string;
}
