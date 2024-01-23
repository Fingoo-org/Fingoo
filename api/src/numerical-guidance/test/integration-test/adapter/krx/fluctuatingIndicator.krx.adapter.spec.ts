import { HttpModule } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { FluctuatingIndicatorsWithoutCacheDto } from 'src/numerical-guidance/application/query/get-fluctuatingIndicators-without-cache/fluctuatingIndicators-without-cache.dto';
import { FluctuatingIndicatorKrxAdapter } from 'src/numerical-guidance/infrastructure/adapter/krx/fluctuatingIndicator.krx.adapter';

const testData = {
  numOfRows: 5,
  pageNo: 1,
  totalCount: 3,
  items: {
    item: [
      {
        basDt: '20230104',
        srtnCd: '005930',
        isinCd: 'KR7005930003',
        itmsNm: '삼성전자',
        mrktCtg: 'KOSPI',
        clpr: '57800',
        vs: '2400',
        fltRt: '4.33',
        mkp: '55700',
        hipr: '58000',
        lopr: '55600',
        trqu: '20188071',
        trPrc: '1151473733800',
        lstgStCnt: '5969782550',
        mrktTotAmt: '345053431390000',
      },
      {
        basDt: '20230103',
        srtnCd: '005930',
        isinCd: 'KR7005930003',
        itmsNm: '삼성전자',
        mrktCtg: 'KOSPI',
        clpr: '55400',
        vs: '-100',
        fltRt: '-.18',
        mkp: '55400',
        hipr: '56000',
        lopr: '54500',
        trqu: '13547030',
        trPrc: '747898872200',
        lstgStCnt: '5969782550',
        mrktTotAmt: '330725953270000',
      },
      {
        basDt: '20230102',
        srtnCd: '005930',
        isinCd: 'KR7005930003',
        itmsNm: '삼성전자',
        mrktCtg: 'KOSPI',
        clpr: '55500',
        vs: '200',
        fltRt: '.36',
        mkp: '55500',
        hipr: '56100',
        lopr: '55200',
        trqu: '10031448',
        trPrc: '558433491400',
        lstgStCnt: '5969782550',
        mrktTotAmt: '331322931525000',
      },
    ],
  },
};

describe('FluctuatingIndicatorKrxAdapter', () => {
  let fluctuatingIndicatorKrxAdapter: FluctuatingIndicatorKrxAdapter;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        HttpModule.registerAsync({
          useFactory: () => ({
            timeout: 5000,
            maxRedirects: 5,
          }),
        }),
      ],
      providers: [
        FluctuatingIndicatorKrxAdapter,
        {
          provide: 'LoadFluctuatingIndicatorWithoutCachePort',
          useClass: FluctuatingIndicatorKrxAdapter,
        },
      ],
    }).compile();
    fluctuatingIndicatorKrxAdapter = module.get(FluctuatingIndicatorKrxAdapter);
  });

  it('외부 API 연동 테스트', async () => {
    // given
    await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicatorWithoutCache(5, '005930', 'KOSPI');

    // when
    const result = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicatorWithoutCache(5, '005930', 'KOSPI');

    // then
    const expected = FluctuatingIndicatorsWithoutCacheDto.create(testData);
    expect(result).toEqual(expected);
  });
});
