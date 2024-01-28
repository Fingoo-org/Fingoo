// view model 계층으로 변경되어야한다.
export type IndicatorBoardMetadata = {
  id: string;
  name: string;
  indicators: Indicator[];
};
export type Indicator = {
  ticker: string;
  name: string;
};
