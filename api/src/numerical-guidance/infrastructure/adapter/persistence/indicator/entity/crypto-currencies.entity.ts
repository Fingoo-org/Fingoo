import { Column, Entity } from 'typeorm';
import { BaseIndicatorEntity } from './base-indicator.entity';

@Entity({ name: 'CryptoCurrencies' })
export class CryptoCurrenciesEntity extends BaseIndicatorEntity {
  @Column('jsonb', { nullable: true })
  available_exchanges: string[];

  @Column()
  currency_base: string;

  @Column()
  currency_quote: string;
}
