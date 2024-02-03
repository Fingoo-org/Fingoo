import { IndicatorEntity } from '../entity/indicator.entity';
import { IndicatorResponse } from 'src/numerical-guidance/application/query/get-indicator-list/indicator-list.dto';

export class IndicatorListMapper {
  static mapDomainToEntity(indicatorEntities: IndicatorEntity[]) {
    const indicatorList: IndicatorResponse[] = indicatorEntities.map((indicator) => ({
      id: indicator['id'],
      name: indicator['name'],
      ticker: indicator['ticker'],
      type: indicator['type'],
    }));
    return indicatorList;
  }
}
