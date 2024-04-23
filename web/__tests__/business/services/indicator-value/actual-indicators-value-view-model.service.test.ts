import { mockDB } from '@/app/mocks/db';
import { ActualIndicatorValue } from '@/app/business/services/view-model/indicator-value/actual-indicators-value-view-model.service';

describe('ActualIndicatorValue', () => {
  it('should create an instance', () => {
    const indicatorValue = mockDB.getIndicatorValue('1');
    const actualIndicatorValue = new ActualIndicatorValue(indicatorValue!);

    expect(actualIndicatorValue).toBeInstanceOf(ActualIndicatorValue);
  });

  it('formatItemsByDate should return formatted items by date', () => {
    const indicatorValue = mockDB.getIndicatorValue('1');
    const actualIndicatorValue = new ActualIndicatorValue(indicatorValue!);

    const formattedItems = actualIndicatorValue.formatItemsByDate({ unitType: 'default' });

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

  it('formatItemsByDate should return formatted items by date with unitType as index', () => {
    const indicatorValue = mockDB.getIndicatorValue('1');
    const actualIndicatorValue = new ActualIndicatorValue(indicatorValue!);

    const formattedItems = actualIndicatorValue.formatItemsByDate({ unitType: 'index' });

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

  // it('formatItemsByDate should return formatted items by date with unitType as MoM', () => {
  //   const indicatorValue = mockDB.getIndicatorValue('1');
  //   const actualIndicatorValue = new ActualIndicatorValue(indicatorValue!);

  //   const formattedItems = actualIndicatorValue.formatItemsByDate({ unitType: 'MoM' });

  //   expect(formattedItems['2024-01-04']).toEqual({
  //     AAPL: {
  //       value: 0,
  //       displayValue: 20000,
  //     },
  //   });
  //   expect(formattedItems['2024-02-04']).toEqual({
  //     AAPL: {
  //       value: 80,
  //       displayValue: 36000,
  //     },
  //   });
  // });

  // it('formatted items by date with unitType as MoM, 주말로 인해 한달 전과 동일한 날짜가 없는 경우', () => {
  //   const indicatorValue = mockDB.getIndicatorValue('1');
  //   const actualIndicatorValue = new ActualIndicatorValue(indicatorValue!);

  //   const formattedItems = actualIndicatorValue.formatItemsByDate({ unitType: 'MoM' });

  //   expect(formattedItems['2024-01-05']).toEqual({
  //     AAPL: {
  //       value: 0,
  //       displayValue: 42000,
  //     },
  //   });
  //   expect(formattedItems['2024-02-07']).toEqual({
  //     AAPL: {
  //       value: -7.14,
  //       displayValue: 39000,
  //     },
  //   });
  // });

  // it('월의 마지막 날이 달라서 동일한 날짜가 없는 경우', () => {
  //   const indicatorValue = mockDB.getIndicatorValue('1');
  //   const actualIndicatorValue = new ActualIndicatorValue(indicatorValue!);

  //   const formattedItems = actualIndicatorValue.formatItemsByDate({ unitType: 'MoM' });

  //   expect(formattedItems['2024-02-29']).toEqual({
  //     AAPL: {
  //       value: 0,
  //       displayValue: 49000,
  //     },
  //   });
  //   expect(formattedItems['2024-03-31']).toEqual({
  //     AAPL: {
  //       value: -12.65,
  //       displayValue: 42800,
  //     },
  //   });
  // });
});
