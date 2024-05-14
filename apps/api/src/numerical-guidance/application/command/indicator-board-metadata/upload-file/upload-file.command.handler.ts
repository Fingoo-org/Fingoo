import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { UploadFileCommand } from './upload-file.command';
import { UploadFilePort } from '../../../port/external/file/upload-file.port';

@Injectable()
@CommandHandler(UploadFileCommand)
export class UploadFileCommandHandler implements ICommandHandler {
  constructor(
    @Inject('UploadFilePort')
    private readonly uploadFilePort: UploadFilePort,
  ) {}

  @Transactional()
  async execute(command: UploadFileCommand): Promise<string> {
    return this.uploadFilePort.uploadFile(command.file);
  }
}
