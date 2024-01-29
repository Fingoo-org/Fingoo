export class IndicatorListDto {
  indicatorList: IndicatorResponse[];
}

export type IndicatorResponse = {
  name: string;
  ticker: string;
  category: string;
};
