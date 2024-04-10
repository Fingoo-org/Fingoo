import { Test } from '@nestjs/testing';
import { CursorPageDto } from '../../../../../utils/pagination/cursor-page.dto';
import { StockDto } from '../../../../application/query/indicator/dto/stock.dto';
import { CursorPageMetaDto } from '../../../../../utils/pagination/cursor-page.meta.dto';
import { GetIndicatorListQueryHandler } from '../../../../application/query/indicator/get-indicator-list.query.handler';
import { GetIndicatorListQuery } from '../../../../application/query/indicator/get-indicator-list.query';
import { LoadIndicatorListPort } from '../../../../application/port/persistence/indicator/load-indicator-list.port';

const testStocksDtos = [
  {
    id: 'a4860dbf-7a91-428d-9c55-f19f356eefd3',
    index: 1,
    indicatorType: 'stocks',
    symbol: '000',
    name: 'Greenvolt - Energias Renováveis, S.A.',
    country: 'Germany',
    currency: 'EUR',
    exchange: 'FSX',
    mic_code: 'XFRA',
    type: 'Common Stock',
  },
  {
    id: 'b812be36-bba7-4341-89e6-2e23617ba0b0',
    index: 2,
    indicatorType: 'stocks',
    symbol: '000',
    name: 'Greenvolt - Energias Renovaveis SA',
    country: 'Germany',
    currency: 'EUR',
    exchange: 'XDUS',
    mic_code: 'XDUS',
    type: 'Common Stock',
  },
  {
    id: 'ff932906-5376-4129-8c85-7b908c6eea26',
    index: 3,
    indicatorType: 'stocks',
    symbol: '000',
    name: 'Greenvolt - Energias Renovaveis SA',
    country: 'Germany',
    currency: 'EUR',
    exchange: 'XBER',
    mic_code: 'XBER',
    type: 'Common Stock',
  },
  {
    id: 'eebe6acf-8afa-46dd-a689-c8414c35d6e8',
    index: 4,
    indicatorType: 'stocks',
    symbol: '000',
    name: 'Greenvolt - Energias Renováveis, S.A.',
    country: 'Germany',
    currency: 'EUR',
    exchange: 'Munich',
    mic_code: 'XMUN',
    type: 'Common Stock',
  },
  {
    id: '1208b350-d50d-4c62-abbe-896bdafb54f5',
    index: 5,
    indicatorType: 'stocks',
    symbol: '000001',
    name: 'Ping An Bank Co., Ltd.',
    country: 'China',
    currency: 'CNY',
    exchange: 'SZSE',
    mic_code: 'XSHE',
    type: 'Common Stock',
  },
  {
    id: 'beacec0d-cadd-41a1-9310-2573a7a6a47b',
    index: 6,
    indicatorType: 'stocks',
    symbol: '000002',
    name: 'China Vanke Co., Ltd.',
    country: 'China',
    currency: 'CNY',
    exchange: 'SZSE',
    mic_code: 'XSHE',
    type: 'Common Stock',
  },
  {
    id: '59dcfb4c-c4d0-421d-b8f2-a37dc6b8239f',
    index: 7,
    indicatorType: 'stocks',
    symbol: '000004',
    name: 'Shenzhen GuoHua Network Security Technology Co., Ltd.',
    country: 'China',
    currency: 'CNY',
    exchange: 'SZSE',
    mic_code: 'XSHE',
    type: 'Common Stock',
  },
  {
    id: '2b6aec75-e5ad-4005-bb89-ae7b8396f51b',
    index: 8,
    indicatorType: 'stocks',
    symbol: '000005',
    name: 'Shenzhen Fountain Corporation',
    country: 'China',
    currency: 'CNY',
    exchange: 'SZSE',
    mic_code: 'XSHE',
    type: 'Common Stock',
  },
  {
    id: 'd4a64b01-b5d8-4c71-96a7-fa95b10a7b43',
    index: 9,
    indicatorType: 'stocks',
    symbol: '000006',
    name: 'Shenzhen Zhenye ',
    country: 'China',
    currency: 'CNY',
    exchange: 'SZSE',
    mic_code: 'XSHE',
    type: 'Common Stock',
  },
  {
    id: 'f52dbfde-bbff-4430-9c63-c6fc8949d5c1',
    index: 10,
    indicatorType: 'stocks',
    symbol: '000007',
    name: 'Shenzhen Quanxinhao Co., Ltd.',
    country: 'China',
    currency: 'CNY',
    exchange: 'SZSE',
    mic_code: 'XSHE',
    type: 'Common Stock',
  },
];

describe('GetIndicatorListQueryHandler', () => {
  let getIndicatorListQueryHandler: GetIndicatorListQueryHandler;
  let loadIndicatorListPort: LoadIndicatorListPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetIndicatorListQueryHandler,
        {
          provide: 'LoadIndicatorListPort',
          useValue: {
            loadIndicatorList: jest.fn().mockImplementation(() => {
              const indicatorDtos = testStocksDtos.map((indicator) => {
                return StockDto.create(indicator);
              });
              const cursorPageMetaDto = new CursorPageMetaDto({
                total: 11,
                hasNextData: false,
                cursor: null,
              });
              return new CursorPageDto<StockDto>(indicatorDtos, cursorPageMetaDto);
            }),
          },
        },
      ],
    }).compile();
    getIndicatorListQueryHandler = module.get(GetIndicatorListQueryHandler);
    loadIndicatorListPort = module.get('LoadIndicatorListPort');
  });

  it('지표 리스트를 가져온다.', async () => {
    // given
    const query: GetIndicatorListQuery = { type: 'stocks', cursorToken: 1 };

    // when
    await getIndicatorListQueryHandler.execute(query);

    // then
    expect(loadIndicatorListPort.loadIndicatorList).toHaveBeenCalledTimes(1);
  });
});
