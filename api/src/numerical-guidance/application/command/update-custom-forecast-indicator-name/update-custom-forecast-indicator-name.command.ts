import { ICommand } from '@nestjs/cqrs';

export class UpdateCustomForecastIndicatorNameCommand implements ICommand {
  constructor(
    readonly id: string,
    readonly name: string,
  ) {}
}
