import { Column, Entity } from 'typeorm';
import { BaseIndicatorEntity } from './base-indicator.entity';
import { IndicatorType } from '../../../../../../utils/type/type-definition';

@Entity({ name: 'forex_pairs' })
export class ForexPairEntity extends BaseIndicatorEntity {
  @Column({ default: 'forex_pairs' })
  indicatorType: IndicatorType;

  @Column({ nullable: true })
  currency_group: string;

  @Column({ nullable: true })
  currency_base: string;

  @Column({ nullable: true })
  currency_quote: string;
}
