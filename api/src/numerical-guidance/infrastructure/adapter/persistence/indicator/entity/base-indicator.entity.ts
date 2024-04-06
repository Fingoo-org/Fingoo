import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';

export class BaseIndicatorEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ generated: 'increment' })
  index: number;

  @Column()
  symbol: string;
}
