import { utcFormat, utcParse } from 'd3-time-format';
import { FormattedItem, IndicatorValue } from '../view-model/indicator-value/indicator-value-view-model.service';
import { UnitType } from './unit-calculator/unit-calculator-factory.service';

export const parseTime = utcParse('%Y%m%d');
export const formatTime = utcFormat('%Y-%m-%d');

export type FormattedIndicatorValue = {
  value: number;
  displayValue: number;
};

export type FormattedRowType = {
  [ticker: string]: FormattedIndicatorValue | string;
};

export class IndicatorFormatter {
  private unitType: UnitType;
  constructor(private indicatorsValue: IndicatorValue[]) {
    this.unitType = indicatorsValue.length > 1 ? 'index' : 'default';
  }

  // fix: date가 빵구나면 순서가 섞이는 문제 발생.. interval에 따라 포메팅..? max 설정할 때 수정
  get formattedIndicatorsByDate() {
    return this.indicatorsValue.reduce<FormattedItem>((acc, indicator) => {
      const formattedItems = indicator.formatItemsByDate({
        isValueWithIndexUnit: this.unitType === 'index',
      });
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
    return Object.keys(formattedIndicatorsByDate).map<FormattedRowType>((date) => {
      return {
        date,
        ...formattedIndicatorsByDate[date],
      };
    });
  }

  get columns() {
    return this.indicatorsValue.map((indicator) => indicator.identifier);
  }

  getIdentifierById(id: string) {
    return this.indicatorsValue.find((indicator) => indicator.id === id)?.identifier;
  }

  getIdentifiersByIds(ids: string[]) {
    return ids.map((id) => ({
      identifier: this.getIdentifierById(id) ?? '',
      indicatorId: id,
    }));
  }
}

export const createIndicatorFormatter = (...indicatorsValue: IndicatorValue[][]) => {
  return new IndicatorFormatter(indicatorsValue.flat());
};

export function chartValueFormatterFactory(categories: string[]) {
  if (categories.length === 1) {
    return (data: FormattedIndicatorValue) => data.displayValue;
  }

  return (data: FormattedIndicatorValue) => data.value;
}
