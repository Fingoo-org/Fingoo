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

  constructor(
    customForecastIndicatorName: string,
    type: IndicatorType,
    targetIndicatorId: string,
    grangerVerification: string[],
    cointJohansenVerification: string[],
    sourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.customForecastIndicatorName = customForecastIndicatorName;
    this.type = type;
    this.targetIndicatorId = targetIndicatorId;
    this.grangerVerification = grangerVerification;
    this.cointJohansenVerification = cointJohansenVerification;
    this.sourceIndicatorIdsAndWeights = sourceIndicatorIdsAndWeights;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static createNew(
    customForecastIndicatorName: string,
    type: IndicatorType,
    targetIndicatorId: string,
    grangerVerification: string[],
    cointJohansenVerification: string[],
    sourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    return new CustomForecastIndicatorEntity(
      customForecastIndicatorName,
      type,
      targetIndicatorId,
      grangerVerification,
      cointJohansenVerification,
      sourceIndicatorIdsAndWeights,
      createdAt,
      updatedAt,
    );
  }
}
