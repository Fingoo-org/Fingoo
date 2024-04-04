import { Column, Entity } from 'typeorm';
import { BaseIndicatorEntity } from './base-indicator.entity';

@Entity({ name: 'ForexPair' })
export class ForexPairEntity extends BaseIndicatorEntity {
  @Column()
  currency_group: string;

  @Column()
  currency_base: string;

  @Column()
  currency_quote: string;
}
