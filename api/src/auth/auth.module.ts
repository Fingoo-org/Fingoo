import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthController } from './api/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from './entity/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
