import { ICommand } from '@nestjs/cqrs';
import { TargetIndicatorInformation } from 'src/utils/type/type-definition';

export class CreateCustomForecastIndicatorCommand implements ICommand {
  constructor(
    readonly customForecastIndicatorName: string,
    readonly targetIndicatorInformation: TargetIndicatorInformation,
    readonly memberId: number,
  ) {}
}
