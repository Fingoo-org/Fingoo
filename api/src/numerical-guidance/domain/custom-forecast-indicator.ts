import { AggregateRoot } from 'src/utils/domain/aggregate-root';
import { IndicatorType } from '../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { v1 as uuid } from 'uuid';
import { CustomForecastIndicatorNameShouldNotEmpty } from './rule/CustomForecastIndicatorNameShouldNotEmpty.rule';
import { SourceIndicatorIdAndWeightType } from 'src/utils/type/type-definition';

export class CustomForecastIndicator extends AggregateRoot {
  readonly id: string;
  customForecastIndicatorName: string;
  type: IndicatorType;
  targetIndicatorId: string;
  grangerVerification: string[];
  cointJohansenVerification: string[];
  sourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[];
  createdAt: Date;
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
    const id = uuid();
    const grangerVerification: string[] = [];
    const cointJohansenVerification: string[] = [];
    const sourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[] = [];
    const type: IndicatorType = 'CustomForecastIndicator';
    return new CustomForecastIndicator(
      id,
      customForecastIndicatorName,
      type,
      targetIndicatorId,
      grangerVerification,
      cointJohansenVerification,
      sourceIndicatorIdsAndWeights,
    );
  }
}