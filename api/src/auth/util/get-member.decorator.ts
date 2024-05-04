import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MemberEntity } from '../entity/member.entity';

export const Member = createParamDecorator((data, ctx: ExecutionContext): MemberEntity => {
  const req = ctx.switchToHttp().getRequest();
  return req.member;
});
