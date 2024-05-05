import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { MemberEntity } from '../entity/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthError } from '@supabase/supabase-js';
import { UserCertificationDto } from '../api/dto/response/user-certification.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    private readonly supabaseService: SupabaseService,
  ) {}

  async singIn(email: string, password: string): Promise<UserCertificationDto> {
    try {
      return await this.supabaseService.signIn(email, password);
    } catch (error) {
      if (error instanceof AuthError) {
        throw new UnauthorizedException({
          HttpStatus: HttpStatus.UNAUTHORIZED,
          error: `[ERROR] 로그인 중 문제가 발생했습니다.`,
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async signUp(email: string, password: string): Promise<UserCertificationDto> {
    try {
      const userCertificationDto = await this.supabaseService.signUp(email, password);
      await this.memberRepository.insert({ id: userCertificationDto.userId, email: email });
      return userCertificationDto;
    } catch (error) {
      if (error instanceof AuthError) {
        throw new UnauthorizedException({
          HttpStatus: HttpStatus.UNAUTHORIZED,
          error: `[ERROR] 회원가입 중 문제가 발생했습니다.`,
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async findById(id: string) {
    return await this.memberRepository.findOneBy({ id });
  }
}
