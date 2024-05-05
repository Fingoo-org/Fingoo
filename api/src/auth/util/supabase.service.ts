import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { ExtractJwt } from 'passport-jwt';

@Injectable({ scope: Scope.REQUEST })
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private clientInstance: SupabaseClient;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly configService: ConfigService,
  ) {}

  async getClient(): Promise<SupabaseClient> {
    this.logger.log('사용자 정보 불러오는 중');
    if (this.clientInstance) {
      this.logger.log(`사용자가 존재합니다. ${this.clientInstance} 님 안녕하세요.`);
      return this.clientInstance;
    }

    this.logger.log('새로운 사용자 정보를 생성하는 중입니다.');

    this.clientInstance = createClient(this.configService.get('SUPABASE_URL'), this.configService.get('SUPABASE_KEY'), {
      auth: { autoRefreshToken: true, persistSession: false, detectSessionInUrl: false },
    });

    await this.clientInstance.auth.getUser(ExtractJwt.fromAuthHeaderAsBearerToken()(this.request));
    this.logger.log('사용자 정보를 성공적으로 생성했습니다.');

    return this.clientInstance;
  }

  async signUp(email: string, password) {
    await this.getClient();
    const {
      data: { user },
    } = await this.clientInstance.auth.signUp({
      email,
      password,
    });
    return user;
  }
}
