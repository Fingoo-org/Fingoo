import { ICommand } from '@nestjs/cqrs';
import { SourceIndicatorIdAndWeightType } from 'src/utils/type/type-definition';

export class UpdateSourceIndicatorsAndWeightsCommand implements ICommand {
  constructor(
    readonly customForecastIndicatorId: string,
    readonly sourceIndicatorsAndWeights: SourceIndicatorIdAndWeightType[],
  ) {}
}
