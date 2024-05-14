import { Column, Entity } from 'typeorm';
import { BaseIndicatorEntity } from './base-indicator.entity';
import { IndicatorType } from '../../../../../../utils/type/type-definition';

@Entity({ name: 'cryptocurrencies' })
export class CryptoCurrenciesEntity extends BaseIndicatorEntity {
  @Column({ default: 'cryptocurrencies' })
  indicatorType: IndicatorType;

  @Column('jsonb', { nullable: true })
  available_exchanges: string[];

  @Column({ nullable: true })
  currency_base: string;

  @Column({ nullable: true })
  currency_quote: string;
}
