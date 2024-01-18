type Meta = {
  symbol: string;
  interval: string;
  exchange: string;
};

type IndicatorValue = {
  datatime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
};

export class FluctuatingIndicatorsDto {
  key: string; // key 값 => symbol + (분단위 첫번째 자리) + (0or5인지 판단 후 합침-> 1분,5분)
  name: string; // AAPL ?
  type: string;
  meta: Meta;
  values: IndicatorValue[];
}
