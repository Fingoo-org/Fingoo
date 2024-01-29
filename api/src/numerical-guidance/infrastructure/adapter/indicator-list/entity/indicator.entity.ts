import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class IndicatorEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  ticker: string;
}
