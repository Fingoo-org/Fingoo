import { ICommand } from '@nestjs/cqrs';
import { UUID } from 'crypto';

export class CreatePostCommand implements ICommand {
  constructor(
    readonly content: string,
    readonly userId: UUID,
  ) {}
}
