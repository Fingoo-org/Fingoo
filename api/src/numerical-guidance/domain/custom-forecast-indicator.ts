import { AggregateRoot } from 'src/utils/domain/aggregate-root';
import { IndicatorType } from '../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { CustomForecastIndicatorNameShouldNotEmpty } from './rule/CustomForecastIndicatorNameShouldNotEmpty.rule';
import { SourceIndicatorIdAndWeightType } from 'src/utils/type/type-definition';
import { ApiProperty } from '@nestjs/swagger';
import { SourceIndicatorsShouldNotDuplicateRule } from './rule/SourceIndicatorsShouldNotDuplicate.rule';
import { SourceIndicatorCountShouldNotExceedLimitRule } from './rule/SourceIndicatorCountShouldNotBeExeedLimit.rule';

export class CustomForecastIndicator extends AggregateRoot {
  @ApiProperty({
    example: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
    description: '예측지표 id',
  })
  readonly id: string;

  @ApiProperty({
    example: 'my first custom forecast indicator',
    description: '예측지표 id',
  })
  customForecastIndicatorName: string;

  @ApiProperty({
    example: 'customForecastIndicator',
    description: '예측지표 타입',
  })
  type: IndicatorType;

  @ApiProperty({
    example: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
    description: '타켓지표 id',
  })
  targetIndicatorId: string;

  @ApiProperty({
    example: [],
    description: '그레인저 검정결과',
  })
  grangerVerification: string[];

  @ApiProperty({
    example: [],
    description: '공적분 검정결과',
  })
  cointJohansenVerification: string[];

  @ApiProperty({
    example: [],
    description: '재료지표와 가중치',
  })
  sourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[];

  @ApiProperty({
    example: '2024-03-08T02:34:57.630Z',
    description: '예측지표 생성 날짜',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-08T02:34:57.630Z',
    description: '예측지표 업데이트 날짜',
  })
  updatedAt: Date;

  constructor(
    id: string,
    customForecastIndicatorName: string,
    type: IndicatorType,
    targetIndicatorId: string,
    grangerVerification: string[],
    cointJohansenVerification: string[],
    sourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[],
  ) {
    super();
    this.checkRule(new CustomForecastIndicatorNameShouldNotEmpty(customForecastIndicatorName));
    this.id = id;
    this.customForecastIndicatorName = customForecastIndicatorName;
    this.type = type;
    this.targetIndicatorId = targetIndicatorId;
    this.grangerVerification = grangerVerification;
    this.cointJohansenVerification = cointJohansenVerification;
    this.sourceIndicatorIdsAndWeights = sourceIndicatorIdsAndWeights;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static createNew(customForecastIndicatorName: string, targetIndicatorId: string): CustomForecastIndicator {
    const grangerVerification: string[] = [];
    const cointJohansenVerification: string[] = [];
    const sourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[] = [];
    const type: IndicatorType = 'customForecastIndicator';
    return new CustomForecastIndicator(
      null,
      customForecastIndicatorName,
      type,
      targetIndicatorId,
      grangerVerification,
      cointJohansenVerification,
      sourceIndicatorIdsAndWeights,
    );
  }

  public updateSourceIndicatorsAndWeights(sourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[]) {
    this.checkRule(new SourceIndicatorsShouldNotDuplicateRule(sourceIndicatorIdsAndWeights));
    this.checkRule(new SourceIndicatorCountShouldNotExceedLimitRule(sourceIndicatorIdsAndWeights));
    const newSourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[] = [];
    for (let i = 0; i < sourceIndicatorIdsAndWeights.length; i++) {
      newSourceIndicatorIdsAndWeights.push(sourceIndicatorIdsAndWeights[i]);
    }
    this.sourceIndicatorIdsAndWeights = newSourceIndicatorIdsAndWeights;
    this.updatedAt = new Date();
  }
}
