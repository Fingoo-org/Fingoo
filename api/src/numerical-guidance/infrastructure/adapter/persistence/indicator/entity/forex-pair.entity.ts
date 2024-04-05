import { Column, Entity } from 'typeorm';
import { BaseIndicatorEntity } from './base-indicator.entity';
import { IndicatorType } from '../../../../../../utils/type/type-definition';

@Entity({ name: 'ForexPair' })
export class ForexPairEntity extends BaseIndicatorEntity {
  @Column({ default: 'forex_pairs' })
  indicatorType: IndicatorType;

  @Column()
  currency_group: string;

  @Column()
  currency_base: string;

  @Column()
  currency_quote: string;
}
