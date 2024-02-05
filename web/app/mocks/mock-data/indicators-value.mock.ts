import { IndicatorValueResponse } from '@/app/querys/numerical-guidance/indicator.query';

export const indicatorsValueMockData: IndicatorValueResponse[] = [
  {
    ticker: 'AAPL',
    items: [
      {
        date: '2020-01-01',
        value: 100,
      },
      {
        date: '2020-01-02',
        value: 200,
      },
      {
        date: '2020-01-03',
        value: 300,
      },
      {
        date: '2020-01-04',
        value: 200,
      },
      {
        date: '2020-01-05',
        value: 100,
      },
      {
        date: '2020-01-06',
        value: 150,
      },
      {
        date: '2020-01-07',
        value: 210,
      },
      {
        date: '2020-01-08',
        value: 410,
      },
      {
        date: '2020-01-09',
        value: 220,
      },
      {
        date: '2020-01-10',
        value: 110,
      },
    ],
  },
  {
    ticker: 'MSFT',
    items: [
      {
        date: '2020-01-01',
        value: 220,
      },
      {
        date: '2020-01-02',
        value: 300,
      },
      {
        date: '2020-01-03',
        value: 120,
      },
      {
        date: '2020-01-04',
        value: 220,
      },
      {
        date: '2020-01-05',
        value: 333,
      },
      {
        date: '2020-01-06',
        value: 444,
      },
      {
        date: '2020-01-07',
        value: 555,
      },
      {
        date: '2020-01-08',
        value: 333,
      },
      {
        date: '2020-01-09',
        value: 112,
      },
      {
        date: '2020-01-10',
        value: 552,
      },
    ],
  },
  {
    ticker: 'GOOG',
    items: [
      {
        date: '2020-01-01',
        value: 321,
      },
      {
        date: '2020-01-02',
        value: 221,
      },
    ],
  },
];
