import {
  LiveKRXIndicatorDto,
  IndicatorValue,
} from '../../../../application/query/live-indicator/dto/live-indicator.dto';

export class LiveIndicatorMapper {
  static mapToDto(stringData: string) {
    const data: {
      indicatorId: string;
      type: string;
      ticker: number;
      name: number;
      market: number;
      totalCount: number;
      values: IndicatorValue[];
    } = JSON.parse(stringData);

    return LiveKRXIndicatorDto.create({
      indicatorId: data.indicatorId,
      type: data.type,
      ticker: data.ticker,
      name: data.name,
      market: data.market,
      totalCount: data.totalCount,
      values: data.values,
    });
  }
}
