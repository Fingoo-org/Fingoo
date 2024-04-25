import { FormattedItem, IndicatorValue } from '../view-model/indicator-value/indicator-value-view-model.service';
import { UnitType } from './unit-calculator/unit-calculator-factory.service';
import { formatDate } from '@/app/utils/date-formatter';

export type FormattedIndicatorValue = {
  value: number;
  displayValue: number;
};

export type FormattedRowType = {
  [ticker: string]: FormattedIndicatorValue | string;
};

function isFormattedIndicatorValue(value: any): value is FormattedIndicatorValue {
  return typeof value === 'object' && value !== null && 'value' in value && 'displayValue' in value;
}

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
        const formattedDate = formatDate(date);
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

  get formmatedIndicatorsToCSV() {
    return this.formattedIndicatorsInRow.map((row) => {
      return Object.keys(row).reduce<{ [key: string]: string | number }>((acc, key) => {
        const value = row[key];
        if (isFormattedIndicatorValue(value)) {
          acc[key] = value.displayValue;
        } else {
          acc[key] = value;
        }

        return acc;
      }, {});
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
