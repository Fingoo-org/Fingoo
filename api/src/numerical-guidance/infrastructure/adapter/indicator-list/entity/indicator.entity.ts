import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class IndicatorEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ticker: string;

  @Column()
  type: string;
}
