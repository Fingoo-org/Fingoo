import { ICommand } from '@nestjs/cqrs';

export class CreateCustomForecastIndicatorCommand implements ICommand {
  constructor(
    readonly customForecastIndicatorName: string,
    readonly targetIndicatorId: string,
  ) {}
}
