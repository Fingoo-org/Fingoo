import { ICommand } from '@nestjs/cqrs';

export class DeleteIndicatorTickerCommand implements ICommand {
  constructor(
    readonly indicatorBoardMetaDataId: string,
    readonly ticker: string,
  ) {}
}
