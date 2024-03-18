import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MemberEntity } from '../../../../../../auth/member.entity';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'IndicatorBoardMetadata' })
export class IndicatorBoardMetadataEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  indicatorBoardMetadataName: string;

  @Column({ type: 'hstore', nullable: true })
  indicatorIds: Record<string, string[]>;

  @Column({ type: 'hstore', nullable: true })
  customForecastIndicatorIds: Record<string, string[]>;

  @ManyToOne(() => MemberEntity, { eager: false })
  member: MemberEntity;
}
