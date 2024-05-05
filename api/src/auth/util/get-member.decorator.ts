import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SupabaseClient, User, UserResponse } from '@supabase/supabase-js';
import * as process from 'process';

export const LoginUser = createParamDecorator(async (_, ctx: ExecutionContext): Promise<User> => {
  const request = ctx.switchToHttp().getRequest();

  const client: SupabaseClient = new SupabaseClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  const token = request.headers.authorization?.split(' ')[1] ?? [];
  const userResponse: UserResponse = await client.auth.getUser(token);
  return userResponse.data.user;
});
