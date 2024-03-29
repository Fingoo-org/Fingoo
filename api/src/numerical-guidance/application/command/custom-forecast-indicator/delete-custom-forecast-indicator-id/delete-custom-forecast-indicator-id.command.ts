import { ICommand } from '@nestjs/cqrs';

export class DeleteCustomForecastIndicatorIdCommand implements ICommand {
  constructor(
    readonly indicatorBoardMetadataId: string,
    readonly customForecastIndicatorId: string,
  ) {}
}
