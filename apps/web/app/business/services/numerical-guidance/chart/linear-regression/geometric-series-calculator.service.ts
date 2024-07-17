import { calculateDateAfter } from '@/app/utils/date-formatter';

type Point = {
  date: string;
  value: number;
};

type Props = {
  startPoint: Point;
};

export class GeometricSeriesCalculator {
  readonly startPoint: Point;
  constructor({ startPoint }: Props) {
    this.startPoint = startPoint;
  }

  calculate(afterDays: number, weight: number) {
    const result = [];
    const theta = weight / 1000;

    for (let i = 0; i <= afterDays - 1; i++) {
      const date = calculateDateAfter(this.startDate, i);
      const value = this.startValue * (theta + 1) ** i;
      result.push({ date, value });
    }

    return result;
  }

  get startDate() {
    return this.startPoint.date;
  }

  get startValue() {
    return this.startPoint.value;
  }
}
