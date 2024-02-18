import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MemberEntity } from '../../../../../auth/member.entity';

@Entity()
export class IndicatorBoardMetadataEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  indicatorBoardMetaDataName: string;

  @Column({ type: 'hstore', nullable: true })
  tickers: Record<string, string[]>;

  @ManyToOne(() => MemberEntity, { eager: false })
  member: MemberEntity;
}
