import { ICommand } from '@nestjs/cqrs';

export class InsertIndicatorTickerCommand implements ICommand {
  constructor(
    readonly id: string,
    readonly ticker: string,
    readonly type: string,
  ) {}
}
