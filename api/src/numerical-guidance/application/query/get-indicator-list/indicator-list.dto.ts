export class IndicatorListDto {
  indicatorList: IndicatorResponse[];

  private constructor(indicatorList: IndicatorResponse[]) {
    this.indicatorList = indicatorList;
  }

  static create({ indicatorList }): IndicatorListDto {
    return new IndicatorListDto(indicatorList);
  }
}

export type IndicatorResponse = {
  name: string;
  ticker: string;
  category: string;
};
