import { ICommand } from '@nestjs/cqrs';

export class DeleteCustomForecastIndicatorCommand implements ICommand {
  constructor(readonly id: string) {}
}
