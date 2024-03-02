import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HistoryIndicatorEntity } from '../../history-indicator/entity/history-indicator.entity';

@Entity({ name: 'historyIndicatorValue' })
export class HistoryIndicatorValueEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date;

  @Column()
  close: string;

  @Column()
  compare: string;

  @Column()
  fluctuation: string;

  @Column()
  open: string;

  @Column()
  high: string;

  @Column()
  low: string;

  @Column()
  volume: string;

  @Column()
  tradingValue: string;

  @Column()
  marketCapitalization: string;

  @Column()
  outstandingShares: string;

  @ManyToOne(() => HistoryIndicatorEntity, (historyIndicator) => historyIndicator.values, { eager: false })
  historyIndicator: HistoryIndicatorEntity;
}
