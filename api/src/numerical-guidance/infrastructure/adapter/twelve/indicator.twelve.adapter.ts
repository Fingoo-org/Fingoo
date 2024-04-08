import { Injectable, Logger } from '@nestjs/common';
import { TwelveApiUtil } from './util/twelve-api.util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveIndicatorListPort } from '../../../application/port/external/twelve/save-indicator-list.port';
import { BondsEntity } from '../persistence/indicator/entity/bonds.entity';
import { CryptoCurrenciesEntity } from '../persistence/indicator/entity/crypto-currencies.entity';
import { ETFEntity } from '../persistence/indicator/entity/etf.entity';
import { ForexPairEntity } from '../persistence/indicator/entity/forex-pair.entity';
import { FundEntity } from '../persistence/indicator/entity/fund.entity';
import { IndicesEntity } from '../persistence/indicator/entity/indices.entity';
import { StockEntity } from '../persistence/indicator/entity/stock.entity';
import { IndicatorType } from '../../../../utils/type/type-definition';
import { Propagation, Transactional } from 'typeorm-transactional';

const indicatorTypes: IndicatorType[] = [
  'bonds',
  'cryptocurrencies',
  'forex_pairs',
  'indices',
  'etf',
  'stocks',
  'funds',
];
const SAVE_DATA_COUNT = 5000;

@Injectable()
export class IndicatorTwelveAdapter implements SaveIndicatorListPort {
  private readonly logger = new Logger(IndicatorTwelveAdapter.name);

  constructor(
    private readonly twelveApiUtil: TwelveApiUtil,
    @InjectRepository(BondsEntity)
    private readonly bondsEntityRepository: Repository<BondsEntity>,
    @InjectRepository(CryptoCurrenciesEntity)
    private readonly cryptoCurrenciesEntityRepository: Repository<CryptoCurrenciesEntity>,
    @InjectRepository(ETFEntity)
    private readonly etfEntityRepository: Repository<ETFEntity>,
    @InjectRepository(ForexPairEntity)
    private readonly forexPairEntityRepository: Repository<ForexPairEntity>,
    @InjectRepository(FundEntity)
    private readonly fundEntityRepository: Repository<FundEntity>,
    @InjectRepository(IndicesEntity)
    private readonly indicesEntityRepository: Repository<IndicesEntity>,
    @InjectRepository(StockEntity)
    private readonly stockEntityRepository: Repository<StockEntity>,
  ) {}

  @Transactional({ propagation: Propagation.REQUIRES_NEW })
  async saveIndicatorList() {
    await this.clearIndicatorList();
    for (const indicatorType of indicatorTypes) {
      const data = await this.twelveApiUtil.getReferenceData(indicatorType);
      await this.insertDataIntoRepository(indicatorType, data);
    }
  }

  private async insertDataIntoRepository(type: IndicatorType, data: any) {
    const dataList = type === 'funds' || type === 'bonds' ? data.result.list : data.data;
    const batchSize = SAVE_DATA_COUNT;

    this.logger.log(`${type} 저장 시작~!`);
    for (let offset = 0; offset < dataList.length; offset += batchSize) {
      const batchEntities = dataList.slice(offset, offset + batchSize);
      await this.insertBatchEntities(type, batchEntities);
    }
    this.logger.log(`${type} 저장 끝~!!!`);
  }

  private async insertBatchEntities(type: IndicatorType, batchEntities: any[]) {
    switch (type) {
      case 'cryptocurrencies':
        await this.cryptoCurrenciesEntityRepository
          .createQueryBuilder()
          .insert()
          .into(CryptoCurrenciesEntity)
          .values(batchEntities)
          .execute();
        break;
      case 'etf':
        await this.etfEntityRepository.createQueryBuilder().insert().into(ETFEntity).values(batchEntities).execute();
        break;
      case 'forex_pairs':
        await this.forexPairEntityRepository
          .createQueryBuilder()
          .insert()
          .into(ForexPairEntity)
          .values(batchEntities)
          .execute();
        break;
      case 'indices':
        await this.indicesEntityRepository
          .createQueryBuilder()
          .insert()
          .into(IndicesEntity)
          .values(batchEntities)
          .execute();
        break;
      case 'stocks':
        await this.stockEntityRepository
          .createQueryBuilder()
          .insert()
          .into(StockEntity)
          .values(batchEntities)
          .execute();
        break;
      case 'funds':
        await this.fundEntityRepository.createQueryBuilder().insert().into(FundEntity).values(batchEntities).execute();
        break;
      case 'bonds':
        await this.bondsEntityRepository
          .createQueryBuilder()
          .insert()
          .into(BondsEntity)
          .values(batchEntities)
          .execute();
        break;
      default:
        throw new Error(`Unsupported indicator type: ${type}`);
    }
  }

  private async clearIndicatorList() {
    await Promise.all([
      this.bondsEntityRepository.clear(),
      this.cryptoCurrenciesEntityRepository.clear(),
      this.etfEntityRepository.clear(),
      this.forexPairEntityRepository.clear(),
      this.fundEntityRepository.clear(),
      this.indicesEntityRepository.clear(),
      this.stockEntityRepository.clear(),
    ]);
  }
}
