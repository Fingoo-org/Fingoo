import { Column, Entity } from 'typeorm';
import { BaseIndicatorEntity } from './base-indicator.entity';
import { IndicatorType } from '../../../../../../utils/type/type-definition';

@Entity({ name: 'bonds' })
export class BondsEntity extends BaseIndicatorEntity {
  @Column({ default: 'bonds' })
  indicatorType: IndicatorType;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  currency: string;

  @Column()
  exchange: string;

  @Column()
  type: string;
}
