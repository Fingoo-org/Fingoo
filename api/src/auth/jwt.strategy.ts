import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MemberEntity } from './member.entity';

@Injectable()
export class JwtStrategy {
  constructor(
    @Inject()
    private authService: AuthService,
  ) {}

  async validate(id) {
    const member: MemberEntity = await this.authService.findById(id);
    return member;
  }
}
