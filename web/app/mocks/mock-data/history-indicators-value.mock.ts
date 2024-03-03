import { HistoryIndicatorValueDataResponse } from '@/app/store/querys/numerical-guidance/history-indicator.query';

export type historyIndicatorsValueMockData = (HistoryIndicatorValueDataResponse & {
  id: string;
})[];
export const historyIndicatorsValueMockData: historyIndicatorsValueMockData = JSON.parse(`[{
  "id": "9785ba85-c924-4269-8238-e1f10b404177",
  "data": {
    "indicator": {
      "id": "9785ba85-c924-4269-8238-e1f10b404177",
      "name": "삼성전자",
      "ticker": "005930",
      "type": "k-stock",
      "market": "KOSPI"
    },
    "values": [
      {
        "date": "20231228",
        "value": "78.5"
      },
      {
        "date": "20231227",
        "value": "78"
      },
      {
        "date": "20231226",
        "value": "76.6"
      },
      {
        "date": "20231222",
        "value": "75.9"
      },
      {
        "date": "20231221",
        "value": "75"
      },
      {
        "date": "20231220",
        "value": "74.8"
      },
      {
        "date": "20231219",
        "value": "73.4"
      },
      {
        "date": "20231218",
        "value": "72.9"
      },
      {
        "date": "20231215",
        "value": "73.3"
      },
      {
        "date": "20231214",
        "value": "73.1"
      },
      {
        "date": "20231213",
        "value": "72.8"
      },
      {
        "date": "20231212",
        "value": "73.5"
      },
      {
        "date": "20231211",
        "value": "73"
      },
      {
        "date": "20231208",
        "value": "72.6"
      },
      {
        "date": "20231207",
        "value": "71.5"
      },
      {
        "date": "20231206",
        "value": "71.7"
      },
      {
        "date": "20231205",
        "value": "71.2"
      },
      {
        "date": "20231204",
        "value": "72.6"
      },
      {
        "date": "20231201",
        "value": "72"
      },
      {
        "date": "20231130",
        "value": "72.8"
      },
      {
        "date": "20231129",
        "value": "72.7"
      },
      {
        "date": "20231128",
        "value": "72.7"
      },
      {
        "date": "20231127",
        "value": "71.3"
      },
      {
        "date": "20231124",
        "value": "71.7"
      },
      {
        "date": "20231123",
        "value": "72.4"
      },
      {
        "date": "20231122",
        "value": "72.8"
      },
      {
        "date": "20231121",
        "value": "72.8"
      },
      {
        "date": "20231120",
        "value": "72.7"
      },
      {
        "date": "20231117",
        "value": "72.5"
      },
      {
        "date": "20231116",
        "value": "72.8"
      },
      {
        "date": "20231115",
        "value": "72.2"
      },
      {
        "date": "20231114",
        "value": "70.8"
      },
      {
        "date": "20231113",
        "value": "70.4"
      },
      {
        "date": "20231110",
        "value": "70.5"
      },
      {
        "date": "20231109",
        "value": "70.3"
      },
      {
        "date": "20231108",
        "value": "69.9"
      },
      {
        "date": "20231107",
        "value": "70.9"
      },
      {
        "date": "20231106",
        "value": "70.9"
      },
      {
        "date": "20231103",
        "value": "69.6"
      },
      {
        "date": "20231102",
        "value": "69.7"
      },
      {
        "date": "20231101",
        "value": "68.6"
      }
    ]
  },
  "meta": {
    "total": 41,
    "hasNextData": true,
    "cursor": "20231031"
  }
}]`);
