import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { MemberEntity } from '../entity/member.entity';
import { AuthGuard } from '../util/auth.guard';
import { Member } from '../util/get-member.decorator';

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
