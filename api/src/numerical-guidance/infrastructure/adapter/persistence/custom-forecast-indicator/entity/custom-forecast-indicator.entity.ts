import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { IndicatorType, SourceIndicatorIdAndWeightType } from 'src/utils/type/type-definition';

@Entity({ name: 'CustomForecastIndicator' })
export class CustomForecastIndicatorEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customForecastIndicatorName: string;

  @Column()
  type: IndicatorType;

  @Column()
  targetIndicatorId: string;

  @Column('jsonb', { nullable: true })
  grangerVerification: string[];

  @Column('jsonb', { nullable: true })
  cointJohansenVerification: string[];

  @Column('jsonb', { nullable: true })
  sourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[];
}
