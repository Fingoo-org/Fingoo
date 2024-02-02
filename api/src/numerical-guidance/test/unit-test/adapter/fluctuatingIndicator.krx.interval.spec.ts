import {
  FluctuatingIndicatorDto,
  Item,
} from 'src/numerical-guidance/application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { FluctuatingIndicatorKrxAdapter } from 'src/numerical-guidance/infrastructure/adapter/krx/fluctuatingIndicator.krx.adapter';
import * as fs from 'fs';

describe('FluctuatingIndicatorKrxIntervalAdapter', () => {
  beforeEach(async () => {});

  it('interval을 week로 설정했을 경우 데이터를 잘 변환하는지 확인', async () => {
    // given

    // when
    const filePath = './src/numerical-guidance/test/data/fluctuatingIndicatorKrxIntervalTestData.json';

    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    const testData = FluctuatingIndicatorDto.create(jsonData);

    const result: Item[] = FluctuatingIndicatorKrxAdapter.calculateWeeklyAverage(testData).items.item;

    const weeklyAverages = result.map((item) => item['weeklyAverage']);

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

    // when
    const filePath = './src/numerical-guidance/test/data/fluctuatingIndicatorKrxIntervalTestData.json';

    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    const testData = FluctuatingIndicatorDto.create(jsonData);

    const result: Item[] = FluctuatingIndicatorKrxAdapter.calculateMonthlyAverage(testData).items.item;

    const monthlyAverages = result.map((item) => item['monthlyAverage']);
    // then
    const expected: string[] = ['74652.94', '73810.53', '71409.09', '67910.53', '70168.42', '66900.00'];
    expect(monthlyAverages).toEqual(expected);
  });

  it('interval을 year로 설정했을 경우 데이터를 잘 변환하는지 확인', async () => {
    //given

    //when
    const filePath = './src/numerical-guidance/test/data/fluctuatingIndicatorKrxIntervalTestData.json';

    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    const testData = FluctuatingIndicatorDto.create(jsonData);
    const result: Item[] = FluctuatingIndicatorKrxAdapter.calculateYearlyAverage(testData).items.item;

    const yearlyAverages = result.map((item) => item['yearlyAverages']);
    // then
    const expected: string[] = ['74652.94', '70656.63'];
    expect(yearlyAverages).toEqual(expected);
  });
});
