import { Injectable } from '@nestjs/common';
import { MemberEntity } from './member.entity';

@Injectable()
export class AuthService {
  async signUp() {
    const memberEntity: MemberEntity = new MemberEntity();
    await memberEntity.save();
  }
}
