import { ICommand } from '@nestjs/cqrs';

export class UpdateSectionsCommand implements ICommand {
  constructor(
    readonly id: string,
    readonly sections: Record<string, string[]>,
  ) {}
}
