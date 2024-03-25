import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { UploadFilePort } from '../../../application/port/external/file/upload-file.port';
import { UploadFileCommandHandler } from '../../../application/command/upload-file/upload-file.command.handler';
import { UploadFileCommand } from '../../../application/command/upload-file/upload-file.command';
import * as fs from 'fs';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('UploadFileCommandHandler', () => {
  let uploadFileCommandHandler: UploadFileCommandHandler;
  let uploadFilePort: UploadFilePort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        UploadFileCommandHandler,
        {
          provide: 'UploadFilePort',
          useValue: {
            uploadFile: jest.fn().mockImplementation(() => {
              const testUrl =
                'https://mlvbynpnwpxewztngrrz.supabase.co/storage/v1/object/public/fingoo_bucket/test/17e0a70c-5f3f-4264-b7d4-780be7f61af7';
              return testUrl;
            }),
          },
        },
      ],
    }).compile();

    uploadFileCommandHandler = module.get(UploadFileCommandHandler);
    uploadFilePort = module.get('UploadFilePort');
  }, 10000);

  it('파일을 업로드한다.', async () => {
    //given
    const imagePath = './src/numerical-guidance/test/data/test-file.png';
    const fileBuffer: Buffer = fs.readFileSync(imagePath);

    const image: Express.Multer.File = {
      fieldname: 'image',
      originalname: 'test-file.png',
      encoding: 'utf-8',
      mimetype: 'image/png',
      size: fileBuffer.length,
      buffer: fileBuffer,
      stream: null,
      destination: null,
      filename: null,
      path: null,
    };

    const command: UploadFileCommand = new UploadFileCommand(image);

    //when
    const expectedURL: string = await uploadFileCommandHandler.execute(command);

    //then
    expect(expectedURL).toEqual(
      'https://mlvbynpnwpxewztngrrz.supabase.co/storage/v1/object/public/fingoo_bucket/test/17e0a70c-5f3f-4264-b7d4-780be7f61af7',
    );
    expect(uploadFilePort.uploadFile).toHaveBeenCalledTimes(1);
  });
});
