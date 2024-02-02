import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MemberEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  static findById(id: number) {
    const memberEntity = this.createQueryBuilder('member').where('member.id = :id', { id }).getOne();
    if (memberEntity == null) {
      throw new Error('[Error] 회원가입을 진행해주세요.');
    }
    return memberEntity;
  }
}
