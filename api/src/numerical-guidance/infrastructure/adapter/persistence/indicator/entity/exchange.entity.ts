import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { IndicatorType } from '../../../../../../utils/type/type-definition';

@Entity({ name: 'Exchange' })
export class ExchangeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ generated: 'increment' })
  index: number;

  @Column({ default: 'exchanges' })
  indicatorType: IndicatorType;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  country: string;

  @Column()
  timezone: string;
}
