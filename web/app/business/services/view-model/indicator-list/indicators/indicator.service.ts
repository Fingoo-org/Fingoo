import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';

export abstract class Indicator {
  readonly id: string;
  readonly indicatorType: IndicatorType;

  constructor(id: string, indicatorType: IndicatorType) {
    this.id = id;
    this.indicatorType = indicatorType;
  }

  abstract get symbol(): string;

  abstract get name(): string;

  abstract get exchange(): string;
}
