import { UnitType, IndicatorValue, FormattedItem } from '../view-model/actual-indicators-value-view-model.service';
import { utcFormat, utcParse } from 'd3-time-format';

export const parseTime = utcParse('%Y%m%d');
export const formatTime = utcFormat('%Y-%m-%d');

export class IndicatorFormatter {
  private unitType: UnitType;
  constructor(private indicatorsValue: IndicatorValue[]) {
    this.unitType = indicatorsValue.length > 1 ? 'index' : 'default';
  }

  get formattedIndicatorsByDate() {
    return this.indicatorsValue.reduce<FormattedItem>((acc, indicator) => {
      const formattedItems = indicator.formattedItemsByDate({ unitType: this.unitType });
      Object.keys(formattedItems).forEach((date) => {
        let formattedDate: string | Date = new Date(date);
        if (formattedDate.toString().startsWith('Invalid')) {
          formattedDate = parseTime(date) ?? new Date(date);
        }
        formattedDate = formatTime(formattedDate);

        acc[formattedDate] = { ...acc[formattedDate], ...formattedItems[date] };
      });
      return acc;
    }, {});
  }

  get formattedIndicatorsInRow() {
    const formattedIndicatorsByDate = this.formattedIndicatorsByDate;
    return Object.keys(formattedIndicatorsByDate).map<{
      [ticker: string]:
        | {
            value: number;
            displayValue: number;
          }
        | string;
    }>((date) => {
      return {
        date,
        ...formattedIndicatorsByDate[date],
      };
    });
  }
}
