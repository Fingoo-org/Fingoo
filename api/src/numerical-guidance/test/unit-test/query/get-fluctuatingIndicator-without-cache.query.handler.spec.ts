import { Test } from '@nestjs/testing';
import { FluctuatingIndicatorsDto } from 'src/numerical-guidance/application/query/get-fluctuatingIndicators/fluctuatingIndicators.dto';
import { GetFluctuatingIndicatorsWithoutCacheQueryHandler } from 'src/numerical-guidance/application/query/get-fluctuatingIndicators-without-cache/get-fluctuatingIndicator-without-cache.query.handler';
import { GetFluctuatingIndicatorsWithoutCacheQuery } from 'src/numerical-guidance/application/query/get-fluctuatingIndicators-without-cache/get-fluctuatingIndicators-without-cache.query';

const testData = {
  numOfRows: 5,
  pageNo: 1,
  totalCount: 1000,
  items: {
    item: [
      {
        basDt: '20240118',
        srtnCd: '005930',
        isinCd: 'KR7005930003',
        itmsNm: '삼성전자',
        mrktCtg: 'KOSPI',
        clpr: '71700',
        vs: '700',
        fltRt: '.99',
        mkp: '71600',
        hipr: '72000',
        lopr: '70700',
        trqu: '17853397',
        trPrc: '1274268001300',
        lstgStCnt: '5969782550',
        mrktTotAmt: '428033408835000',
      },
      {
        basDt: '20240117',
        srtnCd: '005930',
        isinCd: 'KR7005930003',
        itmsNm: '삼성전자',
        mrktCtg: 'KOSPI',
        clpr: '71000',
        vs: '-1600',
        fltRt: '-2.2',
        mkp: '73100',
        hipr: '73300',
        lopr: '71000',
        trqu: '22683660',
        trPrc: '1627050948220',
        lstgStCnt: '5969782550',
        mrktTotAmt: '423854561050000',
      },
      {
        basDt: '20240116',
        srtnCd: '005930',
        isinCd: 'KR7005930003',
        itmsNm: '삼성전자',
        mrktCtg: 'KOSPI',
        clpr: '72600',
        vs: '-1300',
        fltRt: '-1.76',
        mkp: '73500',
        hipr: '73700',
        lopr: '72500',
        trqu: '14760415',
        trPrc: '1075976773200',
        lstgStCnt: '5969782550',
        mrktTotAmt: '433406213130000',
      },
      {
        basDt: '20240115',
        srtnCd: '005930',
        isinCd: 'KR7005930003',
        itmsNm: '삼성전자',
        mrktCtg: 'KOSPI',
        clpr: '73900',
        vs: '800',
        fltRt: '1.09',
        mkp: '73200',
        hipr: '74000',
        lopr: '73200',
        trqu: '13212339',
        trPrc: '973180055524',
        lstgStCnt: '5969782550',
        mrktTotAmt: '441166930445000',
      },
      {
        basDt: '20240112',
        srtnCd: '005930',
        isinCd: 'KR7005930003',
        itmsNm: '삼성전자',
        mrktCtg: 'KOSPI',
        clpr: '73100',
        vs: '-100',
        fltRt: '-.14',
        mkp: '73000',
        hipr: '74100',
        lopr: '72800',
        trqu: '13038939',
        trPrc: '956811865637',
        lstgStCnt: '5969782550',
        mrktTotAmt: '436391104405000',
      },
    ],
  },
};
describe('FluctucatingIndicatorKrxAdapter', () => {
  let getFluctuatingIndicatorsWithoutCacheQueryHandler: GetFluctuatingIndicatorsWithoutCacheQueryHandler;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetFluctuatingIndicatorsWithoutCacheQueryHandler,
        {
          provide: 'LoadFluctuatingIndicatorWithoutCachePort',
          useValue: {
            loadFluctuatingIndicatorWithoutCache: jest.fn().mockImplementation(() => {
              const apiData = FluctuatingIndicatorsDto.create(testData);
              return apiData;
            }),
          },
        },
      ],
    }).compile();
    getFluctuatingIndicatorsWithoutCacheQueryHandler = module.get(GetFluctuatingIndicatorsWithoutCacheQueryHandler);
  });

  it('API 데이터롤 가져온다', async () => {
    // given
    const testQuery = new GetFluctuatingIndicatorsWithoutCacheQuery(5, '005930', 'KOSPI');

    // when
    const result = await getFluctuatingIndicatorsWithoutCacheQueryHandler.execute(testQuery);

    // then
    const expected = FluctuatingIndicatorsDto.create(testData);
    expect(result).toEqual(expected);
  });
});
