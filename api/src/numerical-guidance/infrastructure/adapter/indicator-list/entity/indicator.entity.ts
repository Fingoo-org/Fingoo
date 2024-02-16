import { Market } from 'src/type/market';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class IndicatorEntity extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ticker: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  market: Market;
}
