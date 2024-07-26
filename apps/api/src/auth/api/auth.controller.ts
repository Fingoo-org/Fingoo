import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { SignUpDto } from './dto/request/sign-up.dto';
import { SignInDto } from './dto/request/sign-in.dto';
import { Public } from '../util/is-public.decorator';
import { UserCertificationDto } from './dto/response/user-certification.dto';
import { LoginUser } from '../util/get-login-user.decorator';
import { User } from '@supabase/supabase-js';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { SupabaseService } from '../supabase/supabase.service';
import { ApiExceptionResponse } from '../../utils/exception-filter/api-exception-response.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { CreateIndicatorBoardMetadataCommand } from '../../numerical-guidance/application/command/indicator-board-metadata/create-indicator-board-metadata/create-indicator-board-metadata.command';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly supabaseService: SupabaseService,
    private commandBus: CommandBus,
  ) {}

  @Public()
  @Post('/signUp')
  async signUp(@Body() signUpDto: SignUpDto): Promise<UserCertificationDto> {
    const { email, password } = signUpDto;
    const account = await this.supabaseService.signUp(email, password);

    // 빈 메타데이터를 만듭니다.
    const command = new CreateIndicatorBoardMetadataCommand('빈 메타데이터', account.userId);
    this.commandBus.execute(command);
    return account;
  }

  @ApiCreatedResponse()
  @ApiExceptionResponse(
    404,
    `[ERROR] 로그인 중 오류가 발생했습니다. email과 password를 확인해주세요.`,
    '로그인 중 오류가 발생했습니다. email과 password를 확인해주세요.',
  )
  @Public()
  @Post('/signIn')
  async signIn(@Body() signInDto: SignInDto): Promise<UserCertificationDto> {
    const { email, password } = signInDto;
    return this.supabaseService.signIn(email, password);
  }

  @ApiBearerAuth('Authorization')
  @Get('/check-user')
  async userCheck(@LoginUser() user: User) {
    return user;
  }
}
