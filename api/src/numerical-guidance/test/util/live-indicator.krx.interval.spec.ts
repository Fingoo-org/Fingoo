import {
  LiveKRXIndicatorDto,
  IndicatorValue,
} from 'src/numerical-guidance/application/query/live-indicator/dto/live-indicator.dto';
import * as fs from 'fs';
import { AdjustIndicatorValue } from '../../util/adjust-indicator-value';
import { Interval } from '../../../utils/type/type-definition';

const indicatorId: string = '160e5499-4925-4e38-bb00-8ea6d8056484';

describe('LiveIndicatorKrxIntervalAdapter', () => {
  beforeEach(async () => {});

  it('interval을 week로 설정했을 경우 데이터를 잘 변환하는지 확인', async () => {
    // given
    const filePath = './src/numerical-guidance/test/data/liveIndicatorKrxIntervalTestData.json';

    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    const rawItems = jsonData.items.item;

    const items = [];
    for (let i = 0; i < rawItems.length; i++) {
      const { basDt, clpr } = rawItems[i];

      items.push({
        date: basDt,
        value: clpr,
      });
    }

    const testData = LiveKRXIndicatorDto.create({
      indicatorId,
      type: 'stocks',
      ticker: rawItems[0].srtnCd,
      name: rawItems[0].itmsNm,
      market: rawItems[0].mrktCtg,
      totalCount: jsonData.totalCount,
      values: items,
    });
    const interval: Interval = 'week';

    // when
    const adjustIndicatorValue = new AdjustIndicatorValue();
    const result: IndicatorValue[] = await adjustIndicatorValue.adjustValuesByInterval(testData.values, interval);

    const weeklyAverages = result.map((item) => item['value']);

    // then
    const expected: string[] = [
      '74766.67',
      '72780.00',
      '74220.00',
      '77450.00',
      '77700.00',
      '74400.00',
      '73140.00',
      '71920.00',
      '72300.00',
      '72480.00',
      '71740.00',
      '70500.00',
      '68420.00',
      '67780.00',
      '69100.00',
      '67875.00',
      '66733.33',
      '68800.00',
      '69460.00',
      '71180.00',
      '70520.00',
      '67720.00',
    ];

    expect(weeklyAverages).toEqual(expected);
  });

  it('interval을 month로 설정했을 경우 데이터를 잘 변환하는지 확인', async () => {
    // given
    const filePath = './src/numerical-guidance/test/data/liveIndicatorKrxIntervalTestData.json';

    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    const rawItems = jsonData.items.item;

    const items = [];
    for (let i = 0; i < rawItems.length; i++) {
      const { basDt, clpr } = rawItems[i];

      items.push({
        date: basDt,
        value: clpr,
      });
    }

    const testData = LiveKRXIndicatorDto.create({
      indicatorId,
      type: 'stocks',
      ticker: rawItems[0].srtnCd,
      name: rawItems[0].itmsNm,
      market: rawItems[0].mrktCtg,
      totalCount: jsonData.totalCount,
      values: items,
    });
    const interval: Interval = 'month';
    // when
    const adjustIndicatorValue = new AdjustIndicatorValue();
    const result: IndicatorValue[] = await adjustIndicatorValue.adjustValuesByInterval(testData.values, interval);

    const monthlyAverages = result.map((item) => item['value']);
    // then
    const expected: string[] = ['74652.94', '73810.53', '71409.09', '67910.53', '70168.42', '66900.00'];
    expect(monthlyAverages).toEqual(expected);
  });

  it('interval을 year로 설정했을 경우 데이터를 잘 변환하는지 확인', async () => {
    //given
    const filePath = './src/numerical-guidance/test/data/liveIndicatorKrxIntervalTestData.json';

    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    const rawItems = jsonData.items.item;

    const items = [];
    for (let i = 0; i < rawItems.length; i++) {
      const { basDt, clpr } = rawItems[i];

      items.push({
        date: basDt,
        value: clpr,
      });
    }

    const testData = LiveKRXIndicatorDto.create({
      indicatorId,
      type: 'stocks',
      ticker: rawItems[0].srtnCd,
      name: rawItems[0].itmsNm,
      market: rawItems[0].mrktCtg,
      totalCount: jsonData.totalCount,
      values: items,
    });
    const interval = 'year';

    //when
    const adjustIndicatorValue = new AdjustIndicatorValue();
    const result: IndicatorValue[] = await adjustIndicatorValue.adjustValuesByInterval(testData.values, interval);

    const yearlyAverages = result.map((item) => item['value']);
    // then
    const expected: string[] = ['74652.94', '70656.63'];
    expect(yearlyAverages).toEqual(expected);
  });
});
