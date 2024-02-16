import { IndicatorEntity } from '../entity/indicator.entity';
import {
  Indicator,
  IndicatorListDto,
} from 'src/numerical-guidance/application/query/get-indicator-list/indicator-list.dto';

export class IndicatorListMapper {
  static mapEntityToDto(indicatorEntities: IndicatorEntity[]): IndicatorListDto {
    const indicatorList: Indicator[] = indicatorEntities.map((indicator) => ({
      id: indicator['id'],
      name: indicator['name'],
      ticker: indicator['ticker'],
      type: indicator['type'],
      market: indicator['market'],
    }));
    const indicatorListDto = IndicatorListDto.create(indicatorList);
    return indicatorListDto;
  }
}
