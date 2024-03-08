import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { IndicatorType, SourceIndicatorIdAndWeightType } from 'src/utils/type/type-definition';
import { MemberEntity } from 'src/auth/member.entity';

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

  @ManyToOne(() => MemberEntity, { eager: false })
  member: MemberEntity;

  constructor(
    customForecastIndicatorName: string,
    type: IndicatorType,
    targetIndicatorId: string,
    grangerVerification: string[],
    cointJohansenVerification: string[],
    sourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[],
    member: MemberEntity,
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
    this.member = member;
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
    member: MemberEntity,
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
      member,
      createdAt,
      updatedAt,
    );
  }
}
