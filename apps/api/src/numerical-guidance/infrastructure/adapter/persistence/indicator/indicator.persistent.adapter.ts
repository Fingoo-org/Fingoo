import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Like, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoadIndicatorPort } from '../../../../application/port/persistence/indicator/load-indicator.port';
import { TypeORMError } from 'typeorm/error/TypeORMError';
import { LoadIndicatorListPort } from '../../../../application/port/persistence/indicator/load-indicator-list.port';
import { IndicatorDtoType, IndicatorEntityType, IndicatorType } from '../../../../../utils/type/type-definition';
import { BondsEntity } from './entity/bonds.entity';
import { CryptoCurrenciesEntity } from './entity/crypto-currencies.entity';
import { ETFEntity } from './entity/etf.entity';
import { ForexPairEntity } from './entity/forex-pair.entity';
import { FundEntity } from './entity/fund.entity';
import { IndicesEntity } from './entity/indices.entity';
import { StockEntity } from './entity/stock.entity';
import { CursorPageMetaDto } from '../../../../../utils/pagination/cursor-page.meta.dto';
import { CursorPageDto } from '../../../../../utils/pagination/cursor-page.dto';
import { SaveIndicatorListPort } from '../../../../application/port/external/twelve/save-indicator-list.port';
import { Propagation, Transactional } from 'typeorm-transactional';
import { TwelveApiManager } from '../../twelve/util/twelve-api.manager';
import { IndicatorMapper } from './mapper/indicator.mapper';
import { SearchIndicatorBySymbolPort } from 'src/numerical-guidance/application/port/persistence/indicator/search-indicator-by-symbol.port';
import { SearchIndicatorByTypeAndSymbolPort } from '../../../../application/port/persistence/indicator/search-indicator-by-type-and-symbol.port';
import { EconomyEntity } from './entity/economy.entity';
import { FredApiManager } from '../../fred/util/fred-api.manager';
import { EconomyMapper } from './mapper/economy.mapper';
import { EconomyDto } from '../../../../application/query/indicator/get-indicator-list/dto/economy.dto';

const ORDER_TYPE: string = 'ASC';
const DATA_COUNT: number = 10;
const EMPTY_VALUE_SIZE: number = 0;
const indicatorTypes: IndicatorType[] = [
  'bonds',
  'cryptocurrencies',
  'forex_pairs',
  'indices',
  'etf',
  'stocks',
  'funds',
];
const BATCH_SIZE: number = 1000;

@Injectable()
export class IndicatorPersistentAdapter
  implements
    LoadIndicatorPort,
    LoadIndicatorListPort,
    SaveIndicatorListPort,
    SearchIndicatorBySymbolPort,
    SearchIndicatorByTypeAndSymbolPort
{
  private readonly logger = new Logger(IndicatorPersistentAdapter.name);

  constructor(
    private readonly twelveApiUtil: TwelveApiManager,
    private readonly fredApiUtil: FredApiManager,
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
    @InjectRepository(EconomyEntity)
    private readonly economyEntityRepository: Repository<EconomyEntity>,
  ) {}

  @Transactional({ propagation: Propagation.REQUIRES_NEW })
  async saveIndicatorList(count: number, country: string) {
    await this.clearIndicatorList();
    this.logger.log('[!!지표 리스트 저장 시작!!]');
    console.time('[!!지표 리스트 저장 시간 측정!!]');
    for (const indicatorType of indicatorTypes) {
      const data = await this.twelveApiUtil.getReferenceData(indicatorType, country);
      await this.insertDataIntoRepository(indicatorType, data, count);
    }
    this.logger.log('[!!지표 리스트 저장 끝!!]');
    console.timeEnd('[!!지표 리스트 저장 시간 측정!!]');
  }

  async searchIndicatorBySymbol(symbol: string): Promise<IndicatorDtoType> {
    try {
      let indicatorEntity: any;

      const indicatorRepositories = [
        this.stockEntityRepository,
        this.bondsEntityRepository,
        this.cryptoCurrenciesEntityRepository,
        this.etfEntityRepository,
        this.forexPairEntityRepository,
        this.indicesEntityRepository,
        this.fundEntityRepository,
      ];

      for (const repository of indicatorRepositories) {
        indicatorEntity = await repository.findOneBy({ symbol: symbol });
        if (indicatorEntity) {
          break;
        }
      }

      return IndicatorMapper.mapEntityToDtoByType(indicatorEntity.indicatorType, indicatorEntity);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] ${symbol}: 잘못된 형식의 symbol요청입니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else if (error instanceof TypeORMError || NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] symbol: ${symbol} 해당 symbol의 indicator를 찾을 수 없습니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 지표id를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async searchIndicatorByTypeAndSymbol(symbol: string, type: IndicatorType): Promise<IndicatorDtoType[]> {
    try {
      const repository = await this.repositoryHandler(type);
      const indicatorEntities: [IndicatorEntityType] = await repository.find({
        where: {
          symbol: Like(`${symbol}%`),
        },
      });
      return indicatorEntities.map((indicatorEntity: IndicatorEntityType) => {
        return IndicatorMapper.mapEntityToDtoByType(indicatorEntity.indicatorType, indicatorEntity);
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] ${symbol}: 잘못된 형식의 symbol요청입니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else if (error instanceof TypeORMError || NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] symbol: ${symbol} 해당 symbol의 indicator를 찾을 수 없습니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 지표id를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async searchEconomicIndicator(symbol: string): Promise<EconomyDto[]> {
    try {
      const economyEntity: EconomyEntity = await this.economyEntityRepository.findOneBy({ symbol });

      if (!economyEntity) {
        this.logger.log('save new economy Entity.');
        const economyData: undefined[] = await this.fredApiUtil.searchIndicator(symbol);
        await Promise.all(
          economyData.map(async (data) => {
            const economyEntity: EconomyEntity = EconomyMapper.mapDataToEntity(data);
            await this.economyEntityRepository.save(economyEntity);
            return economyEntity;
          }),
        );
      }

      const economyEntities: EconomyEntity[] = await this.economyEntityRepository.find({
        where: {
          symbol: Like(`${symbol}%`),
        },
      });

      return economyEntities.map((economyEntity: EconomyEntity) => {
        return EconomyMapper.mapEntityToDto(economyEntity);
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] ${symbol}: 잘못된 형식의 symbol요청입니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else if (error instanceof TypeORMError || NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] symbol: ${symbol} 해당 symbol의 indicator를 찾을 수 없습니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 지표id를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async loadIndicatorList(type: IndicatorType, cursorToken: number): Promise<CursorPageDto<IndicatorDtoType>> {
    try {
      const [indicatorEntities, total] = await this.findIndicatorEntitiesByType(type, cursorToken);
      indicatorEntities.map((indicatorEntity) => this.nullCheckForEntity(indicatorEntity));

      const indicatorDtos = IndicatorMapper.mapEntitiesToDtosByType(type, indicatorEntities);
      const nextCursorTokenEntity = await this.getNextCursorTokenEntity(type, cursorToken);

      const { hasNextData, cursor } = this.cursorController(nextCursorTokenEntity, total);
      const cursorPageMetaDto = new CursorPageMetaDto({
        total,
        hasNextData,
        cursor,
      });

      const DTOType = IndicatorMapper.dtoHandler(type);
      return new CursorPageDto<typeof DTOType>(indicatorDtos, cursorPageMetaDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: `[ERROR] index, type 요청이 올바른지 확인해주세요.`,
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else if (error instanceof TypeORMError || NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] index: ${cursorToken} 해당 index의 indicator를 찾을 수 없습니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 지표 리스트를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async loadIndicator(id: string, indicatorType: IndicatorType): Promise<IndicatorDtoType> {
    try {
      const repository = this.repositoryHandler(indicatorType);
      const indicatorEntity = await repository.findOneBy({ id });
      this.nullCheckForEntity(indicatorEntity);
      return IndicatorMapper.mapEntityToDtoByType(indicatorType, indicatorEntity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] id: ${id} 지표를 찾을 수 없습니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else if (error instanceof TypeORMError) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: `[ERROR] 지표를 불러오는 도중에 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 지표를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  private nullCheckForEntity(entity) {
    if (entity == null) throw new NotFoundException();
  }

  private repositoryHandler(type: IndicatorType) {
    const entityRepositories: {
      forex_pairs: Repository<ForexPairEntity>;
      indices: Repository<IndicesEntity>;
      etf: Repository<ETFEntity>;
      bonds: Repository<BondsEntity>;
      funds: Repository<FundEntity>;
      cryptocurrencies: Repository<CryptoCurrenciesEntity>;
      stocks: Repository<StockEntity>;
      economy: Repository<EconomyEntity>;
    } = {
      cryptocurrencies: this.cryptoCurrenciesEntityRepository,
      etf: this.etfEntityRepository,
      forex_pairs: this.forexPairEntityRepository,
      indices: this.indicesEntityRepository,
      stocks: this.stockEntityRepository,
      funds: this.fundEntityRepository,
      bonds: this.bondsEntityRepository,
      economy: this.economyEntityRepository,
    };

    return entityRepositories[type];
  }

  private async findIndicatorEntitiesByType(type: IndicatorType, indexToken: number) {
    const repository = this.repositoryHandler(type);

    if (!repository) {
      throw new Error(`지표 유형에 대한 저장소를 찾을 수 없습니다: ${type}`);
    }

    try {
      return await repository.findAndCount({
        take: DATA_COUNT,
        where: {
          index: MoreThanOrEqual(indexToken),
        },
        order: {
          index: ORDER_TYPE as any,
        },
      });
    } catch (error) {
      throw new BadRequestException({
        HttpStatus: HttpStatus.BAD_REQUEST,
        error: `[ERROR] 지표를 cursor pagination 하는 중에 오류가 발생했습니다. index가 올바른지 확인해주세요.`,
        message: '입력값이 올바른지 확인해주세요.',
        cause: error,
      });
    }
  }

  private async getNextCursorTokenEntity(type: IndicatorType, cursorToken: number) {
    const repository = this.repositoryHandler(type);
    const nextCursorToken = cursorToken + DATA_COUNT;
    return await repository.findOneBy({ index: nextCursorToken });
  }

  private cursorController(cursorToken, valueSize: number) {
    let hasNextData = true;
    let cursor: string;

    if (!cursorToken || valueSize <= EMPTY_VALUE_SIZE) {
      hasNextData = false;
      cursor = null;
    } else {
      cursor = cursorToken.index;
    }
    return { hasNextData, cursor };
  }

  private async insertDataIntoRepository(type: IndicatorType, data: any, count: number) {
    try {
      const dataList = type === 'funds' || type === 'bonds' ? data.result.list : data.data;

      this.logger.log(`${type} 저장 시작~!`);
      for (let i = 0; i < count; i += BATCH_SIZE) {
        if (count < BATCH_SIZE) {
          const batchEntities = dataList.slice(i, i + count);
          await this.insertBatchEntities(type, batchEntities);
          break;
        }
        const batchEntities = dataList.slice(i, i + BATCH_SIZE);
        await this.insertBatchEntities(type, batchEntities);
      }
      this.logger.log(`${type} 저장 끝~!!!`);
    } catch (error) {
      throw new InternalServerErrorException({
        HttpStatus: HttpStatus.BAD_REQUEST,
        error: `[ERROR] 지표를 저장하는 중에 오류가 발생했습니다.`,
        message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
        cause: error,
      });
    }
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
      // 각 엔티티의 데이터를 모두 삭제합니다.
      this.bondsEntityRepository.clear(),
      this.cryptoCurrenciesEntityRepository.clear(),
      this.etfEntityRepository.clear(),
      this.forexPairEntityRepository.clear(),
      this.fundEntityRepository.clear(),
      this.indicesEntityRepository.clear(),
      this.stockEntityRepository.clear(),
      // 시퀀스를 초기화합니다.
      this.bondsEntityRepository.query('ALTER SEQUENCE bonds_index_seq RESTART WITH 1'),
      this.cryptoCurrenciesEntityRepository.query('ALTER SEQUENCE cryptocurrencies_index_seq RESTART WITH 1'),
      this.etfEntityRepository.query('ALTER SEQUENCE etf_index_seq RESTART WITH 1'),
      this.forexPairEntityRepository.query('ALTER SEQUENCE forex_pairs_index_seq RESTART WITH 1'),
      this.fundEntityRepository.query('ALTER SEQUENCE funds_index_seq RESTART WITH 1'),
      this.indicesEntityRepository.query('ALTER SEQUENCE indices_index_seq RESTART WITH 1'),
      this.stockEntityRepository.query('ALTER SEQUENCE stocks_index_seq RESTART WITH 1'),
    ]);
  }
}
