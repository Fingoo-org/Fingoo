import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MemberEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  static findById(id: number) {
    return this.createQueryBuilder('member').where('member.id = :id', { id }).getOne();
  }
}
