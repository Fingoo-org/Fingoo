import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import {
  IndicatorType,
  SourceIndicatorInformation,
  TargetIndicatorInformation,
  Verification,
} from 'src/utils/type/type-definition';
import { MemberEntity } from 'src/auth/member.entity';

@Entity({ name: 'CustomForecastIndicator' })
export class CustomForecastIndicatorEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customForecastIndicatorName: string;

  @Column()
  type: IndicatorType;

  @Column('jsonb', { nullable: true })
  targetIndicatorInformation: TargetIndicatorInformation;

  @Column('jsonb', { nullable: true })
  grangerVerification: Verification[];

  @Column('jsonb', { nullable: true })
  cointJohansenVerification: Verification[];

  @Column('jsonb', { nullable: true })
  sourceIndicatorsInformation: SourceIndicatorInformation[];

  @ManyToOne(() => MemberEntity, { eager: false })
  member: MemberEntity;

  constructor(
    customForecastIndicatorName: string,
    type: IndicatorType,
    targetIndicatorInformation: TargetIndicatorInformation,
    grangerVerification: Verification[],
    cointJohansenVerification: Verification[],
    sourceIndicatorIdsAndWeights: SourceIndicatorInformation[],
    member: MemberEntity,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.customForecastIndicatorName = customForecastIndicatorName;
    this.type = type;
    this.targetIndicatorInformation = targetIndicatorInformation;
    this.grangerVerification = grangerVerification;
    this.cointJohansenVerification = cointJohansenVerification;
    this.sourceIndicatorsInformation = sourceIndicatorIdsAndWeights;
    this.member = member;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static createNew(
    customForecastIndicatorName: string,
    type: IndicatorType,
    targetIndicatorInformation: TargetIndicatorInformation,
    grangerVerification: Verification[],
    cointJohansenVerification: Verification[],
    sourceIndicatorIdsAndWeights: SourceIndicatorInformation[],
    member: MemberEntity,
    createdAt: Date,
    updatedAt: Date,
  ) {
    return new CustomForecastIndicatorEntity(
      customForecastIndicatorName,
      type,
      targetIndicatorInformation,
      grangerVerification,
      cointJohansenVerification,
      sourceIndicatorIdsAndWeights,
      member,
      createdAt,
      updatedAt,
    );
  }
}
