import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HistoryIndicatorEntity } from '../../history-indicator/entity/history-indicator.entity';

@Entity({ name: 'historyIndicatorValue' })
export class HistoryIndicatorValueEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date;

  @Column({ type: 'float' })
  close: number;

  @Column({ type: 'float' })
  compare: number;

  @Column({ type: 'float' })
  fluctuation: number;

  @Column({ type: 'float' })
  open: number;

  @Column({ type: 'float' })
  high: number;

  @Column({ type: 'float' })
  low: number;

  @Column({ type: 'float' })
  volume: number;

  @Column({ type: 'float' })
  tradingValue: number;

  @Column({ type: 'float' })
  marketCapitalization: number;

  @Column({ type: 'float' })
  outstandingShares: number;

  @ManyToOne(() => HistoryIndicatorEntity, (historyIndicator) => historyIndicator.values, { eager: false })
  historyIndicator: HistoryIndicatorEntity;
}
