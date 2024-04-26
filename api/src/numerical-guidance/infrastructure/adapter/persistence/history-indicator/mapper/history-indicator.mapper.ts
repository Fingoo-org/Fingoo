import { HistoryIndicatorValueEntity } from '../../history-indicator-value/entity/history-indicator-value.entity';
import { HistoryIndicatorDto } from '../../../../../application/query/history-indicator/dto/history-indicator.dto';
import { Indicator } from '../../../../../application/query/indicator/basic/dto/indicator.dto';
import { HistoryIndicatorEntity } from '../entity/history-indicator.entity';
import { IndicatorValue } from '../../../../../../utils/type/type-definition';

export class HistoryIndicatorMapper {
  static mapEntitiesToDto(historyIndicatorEntity: HistoryIndicatorEntity, values: IndicatorValue[]) {
    const historyIndicator: Indicator = {
      id: historyIndicatorEntity.id,
      name: historyIndicatorEntity.name,
      ticker: historyIndicatorEntity.ticker,
      type: historyIndicatorEntity.type,
      exchange: historyIndicatorEntity.exchange,
    };
    return HistoryIndicatorDto.create(historyIndicator, values);
  }

  static mapEntitiesToVO(historyIndicatorValueEntities: HistoryIndicatorValueEntity[]) {
    return historyIndicatorValueEntities.map((historyIndicatorValueEntity) => {
      return {
        date: historyIndicatorValueEntity.date,
        close: historyIndicatorValueEntity.close,
        compare: historyIndicatorValueEntity.compare,
        fluctuation: historyIndicatorValueEntity.fluctuation,
        open: historyIndicatorValueEntity.open,
        high: historyIndicatorValueEntity.high,
        low: historyIndicatorValueEntity.low,
        volume: historyIndicatorValueEntity.volume,
        tradingValue: historyIndicatorValueEntity.tradingValue,
        marketCapitalization: historyIndicatorValueEntity.marketCapitalization,
        outstandingShares: historyIndicatorValueEntity.outstandingShares,
      };
    });
  }
}
