import { ICommand } from '@nestjs/cqrs';

export class UpdatePostCommand implements ICommand {
  constructor(
    readonly content: string,
    readonly postId: string,
    readonly userId: string,
  ) {}
}
