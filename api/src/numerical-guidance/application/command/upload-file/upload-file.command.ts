import { ICommand } from '@nestjs/cqrs';

export class UploadFileCommand implements ICommand {
  constructor(readonly file: Express.Multer.File) {}
}
