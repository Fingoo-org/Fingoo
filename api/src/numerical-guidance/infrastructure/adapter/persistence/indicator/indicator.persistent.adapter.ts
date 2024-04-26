import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoadIndicatorPort } from '../../../../application/port/persistence/indicator/load-indicator.port';
import { TypeORMError } from 'typeorm/error/TypeORMError';
import { LoadIndicatorListPort } from '../../../../application/port/persistence/indicator/load-indicator-list.port';
import { IndicatorDtoType, IndicatorType } from '../../../../../utils/type/type-definition';
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
import { Transactional } from 'typeorm-transactional';
import { TwelveApiUtil } from '../../twelve/util/twelve-api.util';
import { IndicatorMapper } from './mapper/indicator.mapper';

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

@Injectable()
export class IndicatorPersistentAdapter implements LoadIndicatorPort, LoadIndicatorListPort, SaveIndicatorListPort {
  private readonly logger = new Logger(IndicatorPersistentAdapter.name);

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
      const data = await this.twelveApiUtil.getReferenceData(indicatorType, 'South Korea');
      await this.insertDataIntoRepository(indicatorType, data, count);
    }

    for (const indicatorType of indicatorTypes) {
      const data = await this.twelveApiUtil.getReferenceData(indicatorType, 'United States');
      await this.insertDataIntoRepository(indicatorType, data, count);
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
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요. 잠시후 다시 시도해주세요.',
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
    } = {
      cryptocurrencies: this.cryptoCurrenciesEntityRepository,
      etf: this.etfEntityRepository,
      forex_pairs: this.forexPairEntityRepository,
      indices: this.indicesEntityRepository,
      stocks: this.stockEntityRepository,
      funds: this.fundEntityRepository,
      bonds: this.bondsEntityRepository,
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
