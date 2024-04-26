import {
  BadRequestException,
  HttpStatus,
  Inject,
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
import {
  IndicatorDtoType,
  IndicatorType,
  IndicatorValue,
  Interval,
  LiveIndicatorDtoType,
} from '../../../../utils/type/type-definition';
import { Transactional } from 'typeorm-transactional';
import { SearchIndicatorPort } from '../../../application/port/persistence/indicator/search-indicator.port';
import {
  SearchedIndicatorsDto,
  SearchedSymbolType,
} from '../../../application/query/indicator/get-indicator-search/dto/searched-indicators.dto';
import { TypeORMError } from 'typeorm/error/TypeORMError';
import { LiveStockDto } from '../../../application/query/live-indicator/get-live-indicator/dto/live-stock.dto';
import { IndicatorValueManager } from '../../../util/indicator-value-manager';
import { LoadLiveIndicatorPort } from '../../../application/port/external/twelve/load-live-indicator.port';
import { LiveEtfDto } from '../../../application/query/live-indicator/get-live-indicator/dto/live-etf.dto';
import { LiveForexPairDto } from '../../../application/query/live-indicator/get-live-indicator/dto/live-forex-pair.dto';
import { LiveIndicesDto } from '../../../application/query/live-indicator/get-live-indicator/dto/live-indices.dto';
import { LiveBondsDto } from '../../../application/query/live-indicator/get-live-indicator/dto/live-bonds.dto';
import { LiveFundDto } from '../../../application/query/live-indicator/get-live-indicator/dto/live-fund.dto';

const indicatorTypes: IndicatorType[] = [
  'bonds',
  'cryptocurrencies',
  'forex_pairs',
  'indices',
  'etf',
  'stocks',
  'funds',
];

export const DAY_NUMBER_OF_DAYS = 35;
export const WEEK_NUMBER_OF_DAYS = 240;
export const MONTH_NUMBER_OF_DAYS = 1000;
export const YEAR_NUMBER_OF_DAYS = 10000;

@Injectable()
export class IndicatorTwelveAdapter implements SaveIndicatorListPort, SearchIndicatorPort, LoadLiveIndicatorPort {
  private readonly logger = new Logger(IndicatorTwelveAdapter.name);

  constructor(
    private readonly twelveApiUtil: TwelveApiUtil,
    @Inject('IndicatorValueManager')
    private readonly indicatorValueManager: IndicatorValueManager<IndicatorValue>,
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
      const data = await this.twelveApiUtil.getReferenceData(indicatorType, 'South Korea');
      await this.insertDataIntoRepository(indicatorType, data, count);
    }

    for (const indicatorType of indicatorTypes) {
      const data = await this.twelveApiUtil.getReferenceData(indicatorType, 'United States');
      await this.insertDataIntoRepository(indicatorType, data, count);
    }
  }

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

  async loadLiveIndicator(
    indicatorDto: IndicatorDtoType,
    interval: Interval,
    rowStartDate: string,
    rowEndDate: string,
  ): Promise<LiveIndicatorDtoType> {
    try {
      const responseData = await this.twelveApiUtil.getTimeSeries(
        indicatorDto.symbol,
        interval,
        rowStartDate,
        rowEndDate,
      );
      const values: any[] = responseData.values.map((value) => {
        return { date: value.datetime, value: value.close };
      });

      const adjustedValuesByInterval = await this.indicatorValueManager.adjustValuesByInterval(values, interval);

      return this.mapToIndicatorDtoByType(indicatorDto, adjustedValuesByInterval, responseData);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `[ERROR] Twelve API response 값을 찾을 수 없습니다. (해당 지표는 현재 plan에서 사용할 수 없습니다.)`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else if (error instanceof Error) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: '[ERROR] API response body 값을 찾을 수 없습니다.',
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: `[ERROR] 잘못된 요청값입니다. indicatorId, interval이 올바른지 확인해주세요.`,
          message: '입력값이 올바른지 확인해주세요. 지표는 day, week, month, year 별로 확인 가능합니다.',
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

  private getIndicatorNameByType(indicatorDto): string {
    if (indicatorDto.type == 'cryptocurrencies') {
      return indicatorDto.symbol;
    }
    return indicatorDto.name;
  }

  private mapToIndicatorDtoByType(indicatorDto, adjustedValuesByInterval, responseData): LiveIndicatorDtoType {
    const baseLiveIndicatorData = {
      indicatorId: indicatorDto.id,
      type: indicatorDto.indicatorType,
      symbol: indicatorDto.symbol,
      name: this.getIndicatorNameByType(indicatorDto),
      exchange: indicatorDto.exchange,
      totalCount: adjustedValuesByInterval.length,
      values: adjustedValuesByInterval,
    };
    switch (indicatorDto.indicatorType) {
      case 'etf':
        return LiveEtfDto.create(baseLiveIndicatorData);
      case 'indices':
        return LiveIndicesDto.create(baseLiveIndicatorData);
      case 'stocks':
        return LiveStockDto.create(baseLiveIndicatorData);
      case 'funds':
        return LiveFundDto.create(baseLiveIndicatorData);
      case 'bonds':
        return LiveBondsDto.create(baseLiveIndicatorData);
      case 'forex_pairs':
        return LiveForexPairDto.create({
          id: indicatorDto.id,
          symbol: indicatorDto.symbol,
          type: indicatorDto.indicatorType,
          currency_group: responseData.meta.currency_group,
          currency_base: responseData.meta.currency_base,
          currency_quote: responseData.meta.currency_quote,
          totalCount: adjustedValuesByInterval.length,
          values: adjustedValuesByInterval,
        });
    }
  }
}
