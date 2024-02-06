import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MemberEntity } from '../../../../../auth/member.entity';

@Entity()
export class IndicatorBoardMetadataEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  indicatorBoardMetaDataName: string;

  @Column({ type: 'hstore', nullable: true })
  indicators: Record<string, string[]>;

  @ManyToOne(() => MemberEntity, { eager: false })
  member: Promise<MemberEntity>;

  static findById(id: number) {
    return this.createQueryBuilder('indicatorBoardMetaDataEntity')
      .where('indicatorBoardMetaDataEntity.id = :id', { id })
      .getOne();
  }
}
