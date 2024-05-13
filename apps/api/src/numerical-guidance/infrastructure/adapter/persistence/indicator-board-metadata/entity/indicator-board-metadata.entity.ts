import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MemberEntity } from '../../../../../../auth/entity/member.entity';
import { BaseEntity } from '../../base.entity';
import { IndicatorInfo } from '../../../../../domain/indicator-board-metadata';

@Entity({ name: 'IndicatorBoardMetadata' })
export class IndicatorBoardMetadataEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  indicatorBoardMetadataName: string;

  @Column('jsonb', { nullable: true })
  indicatorInfos: IndicatorInfo[];

  @Column('jsonb', { nullable: true })
  customForecastIndicatorIds: string[];

  @Column({ type: 'hstore', nullable: true })
  sections: Record<string, string[]>;

  @ManyToOne(() => MemberEntity, { eager: false })
  member: MemberEntity;
}
