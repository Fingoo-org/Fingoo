import { Test } from '@nestjs/testing';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { FileSupabaseAdapter } from '../../../../infrastructure/adapter/storage/file.supabase.adapter';
import * as fs from 'fs';
import { ConfigModule } from '@nestjs/config';

describe('FileSupabaseAdapter', () => {
  let environment;
  let fileSupabaseAdapter: FileSupabaseAdapter;

  beforeAll(async () => {
    environment = await new PostgreSqlContainer().start();

    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [FileSupabaseAdapter],
    }).compile();
    fileSupabaseAdapter = module.get(FileSupabaseAdapter);
  }, 20000);

  afterAll(async () => {
    await environment.stop();
  });

  it('supabase에 파일이 정상적으로 올라가는지 확인', async () => {
    // given
    const imagePath = './src/numerical-guidance/test/data/test-file.png';
    const fileBuffer: Buffer = fs.readFileSync(imagePath);

    const file: Express.Multer.File = {
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

    // when
    const result = await fileSupabaseAdapter.uploadFile(file);
    await fileSupabaseAdapter.deleteFile(file.originalname);

    // then
    const expectName = 'test-file.png';
    expect(expectName).toEqual(result);
  });
});
