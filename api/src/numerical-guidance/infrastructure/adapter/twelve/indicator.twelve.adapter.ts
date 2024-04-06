import { Injectable } from '@nestjs/common';
import { TwelveApiUtil } from './util/twelve-api.util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveIndicatorListPort } from '../../../application/port/external/twelve/save-indicator-list.port';
import { BondsEntity } from '../persistence/indicator/entity/bonds.entity';
import { CryptoCurrenciesEntity } from '../persistence/indicator/entity/crypto-currencies.entity';
import { CryptocurrencyExchangesEntity } from '../persistence/indicator/entity/cryptocurrency-exchanges.entity';
import { ETFEntity } from '../persistence/indicator/entity/etf.entity';
import { ExchangeEntity } from '../persistence/indicator/entity/exchange.entity';
import { ForexPairEntity } from '../persistence/indicator/entity/forex-pair.entity';
import { FundEntity } from '../persistence/indicator/entity/fund.entity';
import { IndicesEntity } from '../persistence/indicator/entity/indices.entity';
import { StockEntity } from '../persistence/indicator/entity/stock.entity';
import { IndicatorType } from '../../../../utils/type/type-definition';

const indicatorTypes: IndicatorType[] = [
  'cryptocurrencies',
  'cryptocurrency_exchanges',
  'etf',
  'exchanges',
  'forex_pairs',
  'indices',
  'stocks',
  'funds',
];

@Injectable()
export class IndicatorTwelveAdapter implements SaveIndicatorListPort {
  constructor(
    private readonly twelveApiUtil: TwelveApiUtil,
    @InjectRepository(BondsEntity)
    private readonly bondsEntityRepository: Repository<BondsEntity>,
    @InjectRepository(CryptoCurrenciesEntity)
    private readonly cryptoCurrenciesEntityRepository: Repository<CryptoCurrenciesEntity>,
    @InjectRepository(CryptocurrencyExchangesEntity)
    private readonly cryptocurrencyExchangesEntityRepository: Repository<CryptocurrencyExchangesEntity>,
    @InjectRepository(ETFEntity)
    private readonly etfEntityRepository: Repository<ETFEntity>,
    @InjectRepository(ExchangeEntity)
    private readonly exchangeEntityRepository: Repository<ExchangeEntity>,
    @InjectRepository(ForexPairEntity)
    private readonly forexPairEntityRepository: Repository<ForexPairEntity>,
    @InjectRepository(FundEntity)
    private readonly fundEntityRepository: Repository<FundEntity>,
    @InjectRepository(IndicesEntity)
    private readonly indicesEntityRepository: Repository<IndicesEntity>,
    @InjectRepository(StockEntity)
    private readonly stockEntityRepository: Repository<StockEntity>,
  ) {}

  async saveIndicatorList() {
    await this.clearIndicatorList();
    indicatorTypes.map(async (indicatorType) => {
      const data = await this.twelveApiUtil.getReferenceData(indicatorType);
      await this.insertDataIntoRepository(indicatorType, data);
    });
  }

  private async insertDataIntoRepository(type: IndicatorType, data: any) {
    switch (type) {
      case 'cryptocurrencies':
        await this.cryptoCurrenciesEntityRepository.insert(data.data);
        break;
      case 'cryptocurrency_exchanges':
        await this.cryptocurrencyExchangesEntityRepository.insert(data.data);
        break;
      case 'etf':
        await this.etfEntityRepository.insert(data.data);
        break;
      case 'exchanges':
        await this.exchangeEntityRepository.insert(data.data);
        break;
      case 'forex_pairs':
        await this.forexPairEntityRepository.insert(data.data);
        break;
      case 'indices':
        await this.indicesEntityRepository.insert(data.data);
        break;
      case 'stocks':
        await this.stockEntityRepository.insert(data.data);
        break;
      case 'funds':
        await this.fundEntityRepository.insert(data.result.list);
        break;
      case 'bonds':
        await this.fundEntityRepository.insert(data.result.list);
        break;
    }
  }

  private async clearIndicatorList() {
    await Promise.all([
      this.bondsEntityRepository.clear(),
      this.cryptoCurrenciesEntityRepository.clear(),
      this.cryptocurrencyExchangesEntityRepository.clear(),
      this.etfEntityRepository.clear(),
      this.exchangeEntityRepository.clear(),
      this.forexPairEntityRepository.clear(),
      this.fundEntityRepository.clear(),
      this.indicesEntityRepository.clear(),
      this.stockEntityRepository.clear(),
    ]);
  }
}
