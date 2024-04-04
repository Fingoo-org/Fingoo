import { Column, Entity } from 'typeorm';
import { BaseIndicatorEntity } from './base-indicator.entity';

@Entity({ name: 'Stock' })
export class StockEntity extends BaseIndicatorEntity {
  @Column()
  name: string;

  @Column()
  currency: string;

  @Column()
  exchange: string;

  @Column()
  mic_code: string;

  @Column()
  country: string;

  @Column()
  type: string;
}
