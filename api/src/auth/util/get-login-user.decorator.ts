import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SupabaseClient, User } from '@supabase/supabase-js';
import * as process from 'process';
import { mockUser } from '../test/data/mock-auth.guard';

export const LoginUser = createParamDecorator(async (_, ctx: ExecutionContext): Promise<User> => {
  const request = ctx.switchToHttp().getRequest();

  const client: SupabaseClient = new SupabaseClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  if (type === 'MockBearer' && token === 'mockingAccessToken') {
    return mockUser;
  }
  const userResponse = await client.auth.getUser(token);
  if (!userResponse.data.user) {
    throw new UnauthorizedException('[ERROR] 토큰이 만료되었습니다 다시 로그인해주세요.');
  }
  return userResponse.data.user;
});
