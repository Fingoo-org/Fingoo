import { LoadHistoryIndicatorPort } from '../../../../application/port/persistence/indicator/load-history-indicator.port';
import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryIndicatorEntity } from './entity/history-indicator.entity';
import { Between, LessThan, LessThanOrEqual, Repository } from 'typeorm';
import { HistoryIndicatorValueEntity } from '../history-indicator-value/entity/history-indicator-value.entity';
import { CursorPageDto } from '../../../../../utils/pagination/cursor-page.dto';
import { HistoryIndicatorDto } from '../../../../application/query/history-indicator/get-history-indicator/dto/history-indicator.dto';
import { CursorPageMetaDto } from '../../../../../utils/pagination/cursor-page.meta.dto';
import { IndicatorValue, Interval } from '../../../../../utils/type/type-definition';
import { HistoryIndicatorMapper } from './mapper/history-indicator.mapper';
import { IndicatorValueManager } from '../../../../util/indicator-value-manager';

const ORDER_TYPE: string = 'DESC';
const INDEXING_COUNT: number = 1;
const DECREASE_NUMBER_OF_DAYS: number = 1;
const EMPTY_VALUE_SIZE: number = 0;
let startDateToken;

@Injectable()
export class HistoryIndicatorPersistentAdapter implements LoadHistoryIndicatorPort {
  constructor(
    @InjectRepository(HistoryIndicatorEntity)
    private readonly historyIndicatorRepository: Repository<HistoryIndicatorEntity>,
    @InjectRepository(HistoryIndicatorValueEntity)
    private readonly historyIndicatorValueRepository: Repository<HistoryIndicatorValueEntity>,
    @Inject('IndicatorValueManager')
    private readonly indicatorValueManager: IndicatorValueManager<IndicatorValue>,
  ) {}

  async loadHistoryIndicator(
    indicatorId: string,
    interval: Interval,
    dataCount: number,
    endDate: string,
  ): Promise<CursorPageDto<HistoryIndicatorDto>> {
    const historyIndicatorEntity: HistoryIndicatorEntity = await this.historyIndicatorRepository.findOneBy({
      id: indicatorId,
    });

    const endDateToken = this.indicatorValueManager.formatStringToDate(endDate);
    let [historyIndicatorValueEntities, total] = [null, null];
    if (interval == 'day') {
      [historyIndicatorValueEntities, total] = await this.findEntitiesByCursorToken(
        historyIndicatorEntity,
        dataCount,
        endDateToken,
      );
    } else {
      [historyIndicatorValueEntities, total] = await this.findEntitiesByCursorTokenByInterval(
        historyIndicatorEntity,
        interval,
        dataCount,
        endDateToken,
      );
    }
    const historyIndicatorValues = HistoryIndicatorMapper.mapEntitiesToVO(historyIndicatorValueEntities);
    let indicatorValues: IndicatorValue[] = historyIndicatorValues.map((historyIndicatorValue) => {
      return {
        date: this.indicatorValueManager.formatDateToString(historyIndicatorValue.date),
        value: historyIndicatorValue.close.toString(),
      };
    });

    indicatorValues = await this.indicatorValueManager.convertIndicatorValueMonthToYear(indicatorValues);

    const historyIndicatorDto = HistoryIndicatorMapper.mapEntitiesToDto(historyIndicatorEntity, indicatorValues);

    if (interval == 'day') {
      const startDateIndex = historyIndicatorValueEntities.length - INDEXING_COUNT;
      startDateToken = historyIndicatorValueEntities[startDateIndex].date;
    }
    const cursorToken = await this.getCursorToken(historyIndicatorEntity, interval, startDateToken);

    const { hasNextData, cursor } = this.cursorController(cursorToken, historyIndicatorValueEntities.length);
    const cursorPageMetaDto = new CursorPageMetaDto({
      total: this.getTotalCount(total, indicatorValues),
      hasNextData,
      cursor,
    });

    return new CursorPageDto<HistoryIndicatorDto>(historyIndicatorDto, cursorPageMetaDto);
  }

  async findEntitiesByCursorToken(
    historyIndicatorEntity: HistoryIndicatorEntity,
    dataCount: number,
    endDateToken: Date,
  ) {
    try {
      return await this.historyIndicatorValueRepository.findAndCount({
        take: dataCount,
        where: {
          date: LessThan(endDateToken),
          historyIndicator: historyIndicatorEntity,
        },
        order: {
          date: ORDER_TYPE as any,
        },
      });
    } catch (error) {
      throw new BadRequestException({
        HttpStatus: HttpStatus.BAD_REQUEST,
        error: `[ERROR] 지표를 cursor pagination 하는 중에 dataCount, endDate에 대한 entity를 찾지 못 했습니다. 올바른 날짜를 입력했는지 확인해주세요.`,
        message: '입력값이 올바른지 확인해주세요.',
        cause: error,
      });
    }
  }

  async findEntitiesByCursorTokenByInterval(
    historyIndicatorEntity: HistoryIndicatorEntity,
    interval: Interval,
    dataCount: number,
    endDateToken: Date,
  ) {
    try {
      const beforeIntervalCount = dataCount - 1;
      if (interval == 'week') {
        startDateToken = this.indicatorValueManager.getDateXWeeksAgo(endDateToken, beforeIntervalCount);
      } else if (interval == 'month') {
        startDateToken = this.indicatorValueManager.getDateXMonthsAgo(endDateToken, beforeIntervalCount);
      } else if (interval == 'year') {
        startDateToken = this.indicatorValueManager.getDateXYearsAgo(endDateToken, beforeIntervalCount);
      }
      return await this.historyIndicatorValueRepository.findAndCount({
        where: {
          date: Between(startDateToken, endDateToken),
          historyIndicator: historyIndicatorEntity,
        },
        order: {
          date: ORDER_TYPE as any,
        },
      });
    } catch (error) {
      throw new BadRequestException({
        message: `[ERROR] 지표를 cursor pagination 하는 중에 startDate, endDate에 대한 entity를 찾지 못 했습니다. 올바른 날짜를 입력했는지 확인해주세요.`,
        error: error,
        HttpStatus: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async getCursorToken(historyIndicatorEntity: HistoryIndicatorEntity, interval: Interval, startDateToken: Date) {
    const tokenOption = new Date(startDateToken);
    tokenOption.setDate(startDateToken.getDate() - DECREASE_NUMBER_OF_DAYS);

    return await this.historyIndicatorValueRepository.findOne({
      where: {
        date: LessThanOrEqual(tokenOption),
        historyIndicator: historyIndicatorEntity,
      },
      order: {
        date: ORDER_TYPE as any,
      },
    });
  }

  private cursorController(cursorToken: HistoryIndicatorValueEntity, valueSize: number) {
    let hasNextData = true;
    let cursor: string;

    if (!cursorToken || valueSize <= EMPTY_VALUE_SIZE) {
      hasNextData = false;
      cursor = null;
    } else {
      cursor = this.indicatorValueManager.formatDateToString(cursorToken.date);
    }
    return { hasNextData, cursor };
  }

  private getTotalCount(total: number, indicatorValues: IndicatorValue[]) {
    if (total != indicatorValues.length) {
      return indicatorValues.length;
    }
    return total;
  }
}
