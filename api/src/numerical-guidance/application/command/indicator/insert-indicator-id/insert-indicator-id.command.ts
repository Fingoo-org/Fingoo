import { ICommand } from '@nestjs/cqrs';

export class InsertIndicatorIdCommand implements ICommand {
  constructor(
    readonly indicatorBoardMetadataId: string,
    readonly indicatorId: string,
  ) {}
}
