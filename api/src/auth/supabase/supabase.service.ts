import { HttpStatus, Inject, Injectable, Logger, NotFoundException, Scope } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { ExtractJwt } from 'passport-jwt';
import { UserCertificationDto } from '../api/dto/response/user-certification.dto';
import * as process from 'process';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberEntity } from '../entity/member.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private clientInstance: SupabaseClient;

  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async getClient(): Promise<SupabaseClient> {
    this.logger.log('사용자 정보 불러오는 중');
    if (this.clientInstance) {
      return this.clientInstance;
    }

    this.logger.log('[싱글톤 인스턴스] 새로운 사용자 정보를 생성하는 중입니다.');

    this.clientInstance = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
      auth: { autoRefreshToken: true, persistSession: false, detectSessionInUrl: false },
    });

    await this.clientInstance.auth.getUser(ExtractJwt.fromAuthHeaderAsBearerToken()(this.request));
    this.logger.log('사용자 정보를 성공적으로 생성했습니다.');

    return this.clientInstance;
  }

  async signUp(email: string, password: string): Promise<UserCertificationDto> {
    await this.getClient();
    const {
      data: { user, session },
    } = await this.clientInstance.auth.signUp({
      email,
      password,
    });
    await this.memberRepository.insert({ id: user.id, email: email });
    return UserCertificationDto.create({ userId: user.id, accessToken: session.access_token });
  }

  async signIn(email: string, password: string): Promise<UserCertificationDto> {
    try {
      await this.getClient();
      const {
        data: { user, session },
        error,
      } = await this.clientInstance.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        this.logger.error(error);
      }
      return UserCertificationDto.create({ userId: user.id, accessToken: session.access_token });
    } catch (error) {
      throw new NotFoundException({
        HttpStatus: HttpStatus.NOT_FOUND,
        error: `[ERROR] 로그인 중 오류가 발생했습니다. email과 password를 확인해주세요.`,
        message: '로그인 중 오류가 발생했습니다. email과 password를 확인해주세요.',
        cause: error,
      });
    }
  }
}
