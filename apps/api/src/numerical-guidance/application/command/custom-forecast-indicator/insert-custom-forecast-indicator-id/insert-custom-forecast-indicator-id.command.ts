import { ICommand } from '@nestjs/cqrs';

export class InsertCustomForecastIndicatorIdCommand implements ICommand {
  constructor(
    readonly indicatorBoardMetadataId: string,
    readonly customForecastIndicatorId: string,
  ) {}
}
