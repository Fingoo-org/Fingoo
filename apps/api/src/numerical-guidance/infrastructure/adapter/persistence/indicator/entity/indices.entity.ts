import { Column, Entity } from 'typeorm';
import { BaseIndicatorEntity } from './base-indicator.entity';
import { IndicatorType } from '../../../../../../utils/type/type-definition';

@Entity({ name: 'indices' })
export class IndicesEntity extends BaseIndicatorEntity {
  @Column({ default: 'indices' })
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
  mic_code: string;
}
