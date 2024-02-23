import { IndicatorType, Market } from 'src/utils/type/type-definition';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'Indicator' })
export class IndicatorEntity extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ticker: string;

  @Column()
  type: IndicatorType;

  @Column({ nullable: true })
  market: Market;
}
