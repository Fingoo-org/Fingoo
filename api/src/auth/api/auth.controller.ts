import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { SignUpDto } from './dto/request/sign-up.dto';
import { SignInDto } from './dto/request/sign-in.dto';
import { Public } from '../util/is-public.decorator';
import { UserCertificationDto } from './dto/response/user-certification.dto';
import { LoginUser } from '../util/get-member.decorator';
import { User } from '@supabase/supabase-js';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signUp')
  async signUp(@Body() signUpDto: SignUpDto): Promise<UserCertificationDto> {
    const { email, password } = signUpDto;
    return this.authService.signUp(email, password);
  }

  @Public()
  @Post('/signIn')
  async signIn(@Body() signInDto: SignInDto): Promise<UserCertificationDto> {
    const { email, password } = signInDto;
    return this.authService.singIn(email, password);
  }

  @ApiBearerAuth('Authorization')
  @Get('/check-user')
  async userCheck(@LoginUser() user: User) {
    return user;
  }
}
