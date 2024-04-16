import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
import { Transactional } from 'typeorm-transactional';
import { SearchIndicatorPort } from '../../../application/port/persistence/indicator/search-indicator.port';
import {
  SearchedIndicatorsDto,
  SearchedSymbolType,
} from '../../../application/query/indicator/get-indicator-search/dto/searched-indicators.dto';
import { TypeORMError } from 'typeorm/error/TypeORMError';

const indicatorTypes: IndicatorType[] = [
  'bonds',
  'cryptocurrencies',
  'forex_pairs',
  'indices',
  'etf',
  'stocks',
  'funds',
];

@Injectable()
export class IndicatorTwelveAdapter implements SaveIndicatorListPort, SearchIndicatorPort {
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

  @Transactional()
  async saveIndicatorList(count: number) {
    await this.clearIndicatorList();
    for (const indicatorType of indicatorTypes) {
      const data = await this.twelveApiUtil.getReferenceData(indicatorType);
      await this.insertDataIntoRepository(indicatorType, data, count);
    }
  }

  @Transactional()
  async searchIndicator(symbol: string): Promise<SearchedIndicatorsDto> {
    try {
      const initData: SearchedSymbolType[] = await this.twelveApiUtil.searchSymbol(symbol);
      const initSymbols: SearchedSymbolType[] = initData.map((data) => data);
      return SearchedIndicatorsDto.create(initSymbols);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: `[ERROR] 검색할 symbol 요청이 올바른지 확인해주세요.`,
          message: '검색할 symbol 요청이 올바른지 확인해주세요.',
          cause: error,
        });
      } else if (error instanceof TypeORMError || NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] symbol: ${symbol} 해당 symbol을 찾을 수 없습니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 지표를 검색하는 중 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  private async insertDataIntoRepository(type: IndicatorType, data: any, count: number) {
    const dataList = type === 'funds' || type === 'bonds' ? data.result.list : data.data;
    const batchSize = count;

    this.logger.log(`${type} 저장 시작~!`);
    const batchEntities = dataList.slice(0, batchSize);
    await this.insertBatchEntities(type, batchEntities);
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
