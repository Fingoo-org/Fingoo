import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { IndicatorType } from '../../../../../../utils/type/type-definition';

@Entity({ name: 'CryptocurrencyExchanges' })
export class CryptocurrencyExchangesEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ generated: 'increment' })
  index: number;

  @Column({ default: 'cryptocurrency_exchanges' })
  indicatorType: IndicatorType;

  @Column()
  name: string;
}
