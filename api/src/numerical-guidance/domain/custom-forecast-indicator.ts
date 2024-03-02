import { AggregateRoot } from 'src/utils/domain/aggregate-root';
import { IndicatorType } from '../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';

export class CustomForecastIndicator extends AggregateRoot {
  readonly id: string;
  customForecastIndicatorName: string;
  type: IndicatorType;
  targetIndicatorId: string;
  grangerVerification: string[];
  cointJohansenVerification: string[];
  sourceIndicatorIdsAndWeights: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    customForecastIndicatorName: string,
    targetIndicatorId: string,
    grangerVerification: string[],
    cointJohansenVerification: string[],
    sourceIndicatorIdsAndWeights: string[],
  ) {
    super();
    this.id = id;
    this.customForecastIndicatorName = customForecastIndicatorName;
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
    const sourceIndicatorIdsAndWeights: string[] = [];
    return new CustomForecastIndicator(
      null,
      customForecastIndicatorName,
      targetIndicatorId,
      grangerVerification,
      cointJohansenVerification,
      sourceIndicatorIdsAndWeights,
    );
  }

  //   static updatesourceIndicatorIdsAndWeights(sourceIndicatorIdsAndWeights: string[]){

  //   }
}
