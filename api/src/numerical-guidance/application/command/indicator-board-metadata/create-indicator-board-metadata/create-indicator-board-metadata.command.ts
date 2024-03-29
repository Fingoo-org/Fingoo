import { ICommand } from '@nestjs/cqrs';

export class CreateIndicatorBoardMetadataCommand implements ICommand {
  constructor(
    readonly indicatorBoardMetadataName: string,
    readonly memberId: number,
  ) {}
}
