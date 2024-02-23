import { ICommand } from '@nestjs/cqrs';

export class DeleteIndicatorTickerCommand implements ICommand {
  constructor(
    readonly indicatorBoardMetadataId: string,
    readonly ticker: string,
  ) {}
}
