import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MemberEntity } from './member.entity';

export const GetMember = createParamDecorator((data, ctx: ExecutionContext): MemberEntity => {
  const req = ctx.switchToHttp().getRequest();
  return req.member;
});
