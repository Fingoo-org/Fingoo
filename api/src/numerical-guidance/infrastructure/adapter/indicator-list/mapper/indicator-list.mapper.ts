import { IndicatorEntity } from '../entity/indicator.entity';
import { Indicator } from 'src/numerical-guidance/application/query/get-indicator-list/indicator-list.dto';

export class IndicatorListMapper {
  static mapEntityToDto(indicatorEntities: IndicatorEntity[]) {
    const indicatorList: Indicator[] = indicatorEntities.map((indicator) => ({
      id: indicator['id'],
      name: indicator['name'],
      ticker: indicator['ticker'],
      type: indicator['type'],
      market: indicator['market'],
    }));
    return indicatorList;
  }
}
