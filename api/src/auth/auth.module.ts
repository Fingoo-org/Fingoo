import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthController } from './api/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from './entity/member.entity';
import { PassportModule } from '@nestjs/passport';
import { SupabaseService } from './supabase/supabase.service';
import { SupabaseStrategy } from './supabase/supabase.strategy';
import { CustomAuthGuard } from './util/custom-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity]), PassportModule],
  controllers: [AuthController],
  providers: [AuthService, SupabaseService, SupabaseStrategy, CustomAuthGuard],
  exports: [AuthService, SupabaseService, SupabaseStrategy, CustomAuthGuard],
})
export class AuthModule {}
