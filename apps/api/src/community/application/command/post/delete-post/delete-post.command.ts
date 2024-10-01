import { ICommand } from '@nestjs/cqrs';

export class DeletePostCommand implements ICommand {
  constructor(
    readonly postId: string,
    readonly userId: string,
  ) {}
}
