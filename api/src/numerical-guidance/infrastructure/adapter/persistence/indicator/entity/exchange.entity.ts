import { Column, Entity } from 'typeorm';
import { BaseIndicatorEntity } from './base-indicator.entity';

@Entity({ name: 'Exchange' })
export class ExchangeEntity extends BaseIndicatorEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  country: string;

  @Column()
  timezone: string;
}
