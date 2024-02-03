export class IndicatorListDto {
  indicatorList: IndicatorResponse[];

  private constructor(indicatorList: IndicatorResponse[]) {
    this.indicatorList = indicatorList;
  }

  static create(indicatorList: IndicatorResponse[]): IndicatorListDto {
    return new IndicatorListDto(indicatorList);
  }
}

export type IndicatorResponse = {
  id: number;
  name: string;
  ticker: string;
  type: string;
};
