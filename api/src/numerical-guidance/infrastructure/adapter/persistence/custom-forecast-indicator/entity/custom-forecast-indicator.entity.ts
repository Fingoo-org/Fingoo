import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { IndicatorDtoType, IndicatorType, Verification } from 'src/utils/type/type-definition';
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
  targetIndicator: IndicatorDtoType;

  @Column('jsonb', { nullable: true })
  grangerVerification: Verification[];

  @Column('jsonb', { nullable: true })
  cointJohansenVerification: Verification[];

  @Column('jsonb', { nullable: true })
  sourceIndicatorsInformation: any[];

  @ManyToOne(() => MemberEntity, { eager: false })
  member: MemberEntity;

  constructor(
    customForecastIndicatorName: string,
    type: IndicatorType,
    targetIndicator: IndicatorDtoType,
    grangerVerification: Verification[],
    cointJohansenVerification: Verification[],
    sourceIndicatorIdsAndWeights: any[],
    member: MemberEntity,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.customForecastIndicatorName = customForecastIndicatorName;
    this.type = type;
    this.targetIndicator = targetIndicator;
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
    targetIndicator: IndicatorDtoType,
    grangerVerification: Verification[],
    cointJohansenVerification: Verification[],
    sourceIndicatorIdsAndWeights: any[],
    member: MemberEntity,
    createdAt: Date,
    updatedAt: Date,
  ) {
    return new CustomForecastIndicatorEntity(
      customForecastIndicatorName,
      type,
      targetIndicator,
      grangerVerification,
      cointJohansenVerification,
      sourceIndicatorIdsAndWeights,
      member,
      createdAt,
      updatedAt,
    );
  }
}
