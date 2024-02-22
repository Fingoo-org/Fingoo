import {
  FluctuatingIndicatorDto,
  Item,
} from '../../../../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';

export class FluctuatingIndicatorMapper {
  static mapToDto(stringData: string) {
    const data: {
      type: string;
      ticker: number;
      name: number;
      market: number;
      totalCount: number;
      items: Item[];
    } = JSON.parse(stringData);

    return FluctuatingIndicatorDto.create({
      type: data.type,
      ticker: data.ticker,
      name: data.name,
      market: data.market,
      totalCount: data.totalCount,
      items: data.items,
    });
  }
}
