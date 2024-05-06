import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthController } from './api/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from './entity/member.entity';
import { PassportModule } from '@nestjs/passport';
import { SupabaseStrategy } from './supabase/supabase.strategy';
import { SupabaseService } from './supabase/supabase.service';

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity]), PassportModule],
  controllers: [AuthController],
  providers: [AuthService, SupabaseService, SupabaseStrategy],
})
export class AuthModule {}
