import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as process from 'process';
import { UploadFilePort } from '../../../application/port/external/file/upload-file.port';
import { uuid } from '@supabase/supabase-js/dist/main/lib/helpers';

@Injectable()
export class FileSupabaseAdapter implements UploadFilePort {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
      const { mimetype, buffer } = file;
      const newRandomName: string = uuid();

      await supabase.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .upload(`indicatorBoardMetadata/${newRandomName}`, buffer, { contentType: mimetype });
      return newRandomName;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] file path: ${file.path} 해당 파일을 찾을 수 없습니다.`,
          message: '파일 경로를 다시 확인해주세요.',
          cause: error,
        });
      } else if (error instanceof TypeError) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: `[ERROR] 빈 파일이 요청되었습니다. 파일이 정상적으로 요청되었는지 확인해주세요.`,
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `[ERROR] 파일을 업로드 하는 과정에서 오류가 발생했습니다.`,
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async deleteFile(filePath: string) {
    try {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

      await supabase.storage.from('avatars').remove([filePath]);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] file path: ${filePath} 해당 파일을 찾을 수 없습니다.`,
          message: '파일 경로를 다시 확인해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `[ERROR] 파일을 삭제 하는 과정에서 오류가 발생했습니다.`,
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }
}
