import { Column, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { IndicatorType } from '../../../../../../utils/type/type-definition';

export class BaseIndicatorEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Generated('increment')
  index: number;

  @Column()
  indicatorType: IndicatorType;

  @Column()
  symbol: string;
}
