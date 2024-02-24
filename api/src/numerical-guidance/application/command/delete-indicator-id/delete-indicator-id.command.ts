import { ICommand } from '@nestjs/cqrs';

export class DeleteIndicatorIdCommand implements ICommand {
  constructor(
    readonly indicatorBoardMetadataId: string,
    readonly indicatorId: string,
  ) {}
}
