import { IndicatorEntity } from 'src/numerical-guidance/infrastructure/adapter/indicator-list/entity/indicator.entity';

export class IndicatorListDto {
  indicatorList: IndicatorResponse[];

  private constructor(indicatorList: IndicatorResponse[]) {
    this.indicatorList = indicatorList;
  }

  static create(indicatorEntities: IndicatorEntity[]): IndicatorListDto {
    // Entity를 indicatorList로 변환하는 로직
    const indicatorList: IndicatorResponse[] = indicatorEntities.map((indicator) => ({
      id: indicator['id'],
      name: indicator['name'],
      ticker: indicator['ticker'],
      type: indicator['type'],
    }));
    return new IndicatorListDto(indicatorList);
  }
}

export type IndicatorResponse = {
  id: number;
  name: string;
  ticker: string;
  type: string;
};
