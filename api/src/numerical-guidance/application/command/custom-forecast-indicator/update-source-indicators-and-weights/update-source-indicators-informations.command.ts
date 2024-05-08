import { ICommand } from '@nestjs/cqrs';
import { SourceIndicatorRequestInformation } from 'src/utils/type/type-definition';

export class UpdateSourceIndicatorsInformationCommand implements ICommand {
  constructor(
    readonly customForecastIndicatorId: string,
    readonly sourceIndicatorsRequestInformation: SourceIndicatorRequestInformation[],
  ) {}
}
