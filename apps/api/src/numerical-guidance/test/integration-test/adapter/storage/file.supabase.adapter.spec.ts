import { Test } from '@nestjs/testing';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { FileSupabaseAdapter } from '../../../../infrastructure/adapter/storage/supabase/file.supabase.adapter';
import * as fs from 'fs';
import { ConfigModule } from '@nestjs/config';
import { HttpStatus, NotFoundException } from '@nestjs/common';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
  }, 80000);

  afterAll(async () => {
    await environment.stop();
  });

  it('supabase 파일 업로드', async () => {
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
    const expectInvalidName = null;
    expect(expectInvalidName).not.toEqual(result);
    expect(result).toMatch(uuidPattern);
  }, 100000);

  it('supabase 파일 업로드 - 빈 파일을 보내는 경우', async () => {
    // given

    const emptyFile: Express.Multer.File = null;

    // when // then
    await expect(async () => {
      await fileSupabaseAdapter.uploadFile(emptyFile);
    }).rejects.toThrow(
      new NotFoundException({
        HttpStatus: HttpStatus.BAD_REQUEST,
        error: `[ERROR] 빈 파일이 요청되었습니다. 파일이 정상적으로 요청되었는지 확인해주세요.`,
        message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
        cause: Error,
      }),
    );
  }, 100000);
});
