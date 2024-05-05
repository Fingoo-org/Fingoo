import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import * as process from 'process';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(SupabaseStrategy.name);

  constructor(private readonly supabaseService: SupabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SUPABASE_KEY,
    });
  }

  async validate(token: string) {
    const supabaseClient = await this.supabaseService.getClient();
    const user = supabaseClient.auth.getUser(token);
    return user;
  }
}
