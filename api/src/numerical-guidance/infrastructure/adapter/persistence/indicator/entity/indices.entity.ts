import { Column, Entity } from 'typeorm';
import { BaseIndicatorEntity } from './base-indicator.entity';

@Entity({ name: 'Indices' })
export class IndicesEntity extends BaseIndicatorEntity {
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
