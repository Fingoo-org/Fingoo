import { Injectable } from '@nestjs/common';
import { MemberEntity } from './member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
  ) {}

  async signUp() {
    const memberEntity = this.memberRepository.create();
    await this.memberRepository.save(memberEntity);
  }

  async findById(id: number) {
    return await this.memberRepository.findOneBy({ id });
  }
}
