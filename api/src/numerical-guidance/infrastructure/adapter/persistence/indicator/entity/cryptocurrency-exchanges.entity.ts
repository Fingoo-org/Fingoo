import { Column, Entity } from 'typeorm';
import { BaseIndicatorEntity } from './base-indicator.entity';

@Entity({ name: 'CryptocurrencyExchanges' })
export class CryptocurrencyExchangesEntity extends BaseIndicatorEntity {
  @Column()
  name: string;
}
