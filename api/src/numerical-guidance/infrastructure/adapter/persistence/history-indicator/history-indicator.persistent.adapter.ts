import { LoadHistoryIndicatorPort } from '../../../../application/port/persistence/indicator/load-history-indicator.port';
import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryIndicatorEntity } from './entity/history-indicator.entity';
import { Between, LessThanOrEqual, Repository } from 'typeorm';
import { HistoryIndicatorValueEntity } from '../history-indicator-value/entity/history-indicator-value.entity';
import { CursorPageDto } from '../../../../../utils/pagination/cursor-page.dto';
import { HistoryIndicatorDto } from '../../../../application/query/get-history-indicator/history-indicator.dto';
import { CursorPageMetaDto } from '../../../../../utils/pagination/cursor-page.meta.dto';
import { Interval } from '../../../../../utils/type/type-definition';
import { HistoryIndicatorMapper } from './mapper/history-indicator.mapper';
import { IndicatorValue } from '../../../../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { IndicatorValueManager } from '../../../../util/indicator-value-manager';

const ORDER_TYPE: string = 'DESC';

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
    startDate: string,
    endDate: string,
  ): Promise<CursorPageDto<HistoryIndicatorDto>> {
    const historyIndicatorEntity: HistoryIndicatorEntity = await this.historyIndicatorRepository.findOneBy({
      id: indicatorId,
    });

    const startDateToken = this.indicatorValueManager.formatStringToDate(startDate);
    const endDateToken = this.indicatorValueManager.formatStringToDate(endDate);
    const [historyIndicatorValueEntities, total] = await this.findEntitiesByCursorToken(startDateToken, endDateToken);

    const historyIndicatorValues = HistoryIndicatorMapper.mapEntitiesToVO(historyIndicatorValueEntities);
    let indicatorValues: IndicatorValue[] = historyIndicatorValues.map((historyIndicatorValue) => {
      return {
        date: this.indicatorValueManager.formatDateToString(historyIndicatorValue.date),
        value: historyIndicatorValue.close,
      };
    });
    indicatorValues = await this.indicatorValueManager.adjustValuesByInterval(indicatorValues, interval);

    const historyIndicatorDto = HistoryIndicatorMapper.mapEntitiesToDto(historyIndicatorEntity, indicatorValues);

    const cursorToken = await this.getCursorToken(startDateToken);
    const { hasNextData, cursor } = this.cursorController(cursorToken, historyIndicatorValueEntities.length);
    const cursorPageMetaDto = new CursorPageMetaDto({
      total: this.getTotalCount(total, indicatorValues),
      hasNextData,
      cursor,
    });

    return new CursorPageDto<HistoryIndicatorDto>(historyIndicatorDto, cursorPageMetaDto);
  }

  async findEntitiesByCursorToken(startDateToken: Date, endDateToken: Date) {
    try {
      return await this.historyIndicatorValueRepository.findAndCount({
        where: {
          date: Between(startDateToken, endDateToken),
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

  async getCursorToken(startDateToken: Date) {
    const tokenOption = new Date(startDateToken);
    tokenOption.setDate(startDateToken.getDate() - 1);

    return await this.historyIndicatorValueRepository.findOne({
      where: {
        date: LessThanOrEqual(tokenOption),
      },
    });
  }

  private cursorController(cursorToken: HistoryIndicatorValueEntity, valueSize: number) {
    let hasNextData = true;
    let cursor: string;

    if (!cursorToken || valueSize <= 0) {
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
