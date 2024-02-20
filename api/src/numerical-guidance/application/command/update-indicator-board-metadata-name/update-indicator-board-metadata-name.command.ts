import { ICommand } from '@nestjs/cqrs';

export class UpdateIndicatorBoardMetadataNameCommand implements ICommand {
  constructor(
    readonly id: string,
    readonly name: string,
  ) {}
}
