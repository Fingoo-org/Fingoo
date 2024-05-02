import { ICommand } from '@nestjs/cqrs';

export class SaveIndicatorListCommand implements ICommand {
  constructor(
    readonly count: number,
    readonly country: string,
  ) {}
}
