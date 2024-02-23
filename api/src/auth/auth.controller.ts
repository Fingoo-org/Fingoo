import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MemberEntity } from './member.entity';
import { AuthGuard } from './auth.guard';
import { Member } from './get-member.decorator';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  signUp(): Promise<void> {
    return this.authService.signUp();
  }

  @UseGuards(AuthGuard)
  @Get('/signIn')
  signIn(@Member() member: MemberEntity): number {
    this.authService.findById(member.id);
    return member.id;
  }
}
