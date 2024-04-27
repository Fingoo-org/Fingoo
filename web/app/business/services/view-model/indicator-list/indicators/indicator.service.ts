import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';

export abstract class Indicator {
  readonly id: String;
  readonly indicatorType: IndicatorType;

  constructor(id: String, indicatorType: IndicatorType) {
    this.id = id;
    this.indicatorType = indicatorType;
  }

  abstract get symbol(): String;

  abstract get name(): String;

  abstract get exchange(): String;
}
