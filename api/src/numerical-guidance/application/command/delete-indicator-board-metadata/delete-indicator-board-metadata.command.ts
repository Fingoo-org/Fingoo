import { ICommand } from '@nestjs/cqrs';

export class DeleteIndicatorBoardMetadataCommand implements ICommand {
  constructor(readonly id: string) {}
}
