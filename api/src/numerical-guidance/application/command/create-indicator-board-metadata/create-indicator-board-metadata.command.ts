import { ICommand } from '@nestjs/cqrs';

export class CreateIndicatorBoardMetadataCommand implements ICommand {
  constructor(
    readonly indicatorBoardMetaDataName: string,
    readonly memberId: number,
  ) {}
}
