import { mockDB } from '@/app/mocks/db';
import { ActualIndicatorValue } from '@/app/business/services/view-model/indicator-value/actual-indicators-value-view-model.service';

describe('ActualIndicatorValue', () => {
  it('should create an instance', () => {
    const indicatorValue = mockDB.getIndicatorValue('1');
    const actualIndicatorValue = new ActualIndicatorValue(indicatorValue!);

    expect(actualIndicatorValue).toBeInstanceOf(ActualIndicatorValue);
  });

  it('formattedItemsByDate should return formatted items by date', () => {
    const indicatorValue = mockDB.getIndicatorValue('1');
    const actualIndicatorValue = new ActualIndicatorValue(indicatorValue!);

    const formattedItems = actualIndicatorValue.formattedItemsByDate({ unitType: 'default' });

    expect(formattedItems['2024-01-01']).toEqual({
      AAPL: {
        value: 10000,
        displayValue: 10000,
      },
    });
    expect(formattedItems['2024-01-21']).toEqual({
      AAPL: {
        value: 22000,
        displayValue: 22000,
      },
    });
    expect(formattedItems['2024-01-31']).toEqual({
      AAPL: {
        value: 32000,
        displayValue: 32000,
      },
    });
  });

  it('formattedItemsByDate should return formatted items by date with unitType as index', () => {
    const indicatorValue = mockDB.getIndicatorValue('1');
    const actualIndicatorValue = new ActualIndicatorValue(indicatorValue!);

    const formattedItems = actualIndicatorValue.formattedItemsByDate({ unitType: 'index' });

    console.log(formattedItems);
    expect(formattedItems['2024-01-01']).toEqual({
      AAPL: {
        value: 0,
        displayValue: 10000,
      },
    });
    expect(formattedItems['2024-01-18']).toEqual({
      AAPL: {
        value: 20,
        displayValue: 19000,
      },
    });
    expect(formattedItems['2024-01-27']).toEqual({
      AAPL: {
        value: 40,
        displayValue: 28000,
      },
    });
  });
});
