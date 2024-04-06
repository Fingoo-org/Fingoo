import { Column, Entity } from 'typeorm';
import { BaseIndicatorEntity } from './base-indicator.entity';
import { IndicatorType } from '../../../../../../utils/type/type-definition';

@Entity({ name: 'CryptoCurrencies' })
export class CryptoCurrenciesEntity extends BaseIndicatorEntity {
  @Column({ default: 'cryptocurrencies' })
  indicatorType: IndicatorType;

  @Column('jsonb', { nullable: true })
  available_exchanges: string[];

  @Column()
  currency_base: string;

  @Column()
  currency_quote: string;
}
