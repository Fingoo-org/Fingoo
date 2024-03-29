import { Injectable } from '@nestjs/common';
import { IndicatorValueManager } from './indicator-value-manager';
import { IndicatorValue } from '../application/query/live-indicator/dto/live-indicator.dto';

@Injectable()
export class AdjustIndicatorValue extends IndicatorValueManager<IndicatorValue> {
  private processedValues: Set<string> = new Set<string>();

  public calculateValues(boundValues: IndicatorValue[], identifier: string): IndicatorValue[] {
    const calculatedValues = [];

    if (boundValues.length > 0) {
      if (!this.processedValues.has(identifier)) {
        const boundValueSum = boundValues.reduce((sum, item) => sum + parseInt(item.value), 0);
        const average = boundValueSum / boundValues.length;

        const { date } = boundValues[0];

        calculatedValues.push({
          date,
          value: average.toFixed(2),
        });

        this.processedValues.add(identifier);
      }
    }
    return calculatedValues;
  }

  public getCurrentDateString(value: IndicatorValue): string {
    return value.date;
  }

  public resetDataStructure(): void {
    this.processedValues.clear();
  }
}
