import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { MemberEntity } from '../entity/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
  ) {}

  async findById(id: string): Promise<MemberEntity> {
    try {
      const memberEntity: MemberEntity = await this.memberRepository.findOneBy({ id });
      this.nullCheckForEntity(memberEntity);
      return memberEntity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] memberId: ${id} 해당 회원을 찾을 수 없습니다.`,
          message: '회원 정보가 올바른지 확인해주세요.',
          cause: error,
        });
      }
    }
  }

  private nullCheckForEntity(entity) {
    if (entity == null) throw new NotFoundException();
  }
}
