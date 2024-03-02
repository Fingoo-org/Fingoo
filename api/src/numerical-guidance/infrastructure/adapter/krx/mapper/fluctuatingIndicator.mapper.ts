import {
  FluctuatingIndicatorDto,
  IndicatorValue,
} from '../../../../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';

export class FluctuatingIndicatorMapper {
  static mapToDto(stringData: string) {
    const data: {
      type: string;
      ticker: number;
      name: number;
      market: number;
      totalCount: number;
      values: IndicatorValue[];
    } = JSON.parse(stringData);

    return FluctuatingIndicatorDto.create({
      type: data.type,
      ticker: data.ticker,
      name: data.name,
      market: data.market,
      totalCount: data.totalCount,
      values: data.values,
    });
  }
}
