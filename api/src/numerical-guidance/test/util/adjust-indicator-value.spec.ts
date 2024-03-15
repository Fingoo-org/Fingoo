import { AdjustIndicatorValue } from '../../util/adjust-indicator-value';
import * as fs from 'fs';
import { IndicatorValue } from '../../application/query/get-live-indicator/live-indicator.dto';
import { Interval } from '../../../utils/type/type-definition';

const filePath = './src/numerical-guidance/test/data/history-indicator.json';
const data = fs.readFileSync(filePath, 'utf8');
const mockHistoryIndicatorValues = JSON.parse(data);

describe('AdjustIndicatorValue(extends IndicatorValueManager)', () => {
  it('Day interval 에 따른 indicatorValue 변환', async () => {
    // given
    const adjustIndicatorValue = new AdjustIndicatorValue();

    const historyIndicatorValues: IndicatorValue[] = mockHistoryIndicatorValues.map((value) => {
      return {
        date: adjustIndicatorValue.formatDateToString(new Date(value.date)),
        value: value.close,
      };
    });

    const interval: Interval = 'day';

    // when
    const resultIndicatorValues: IndicatorValue[] = await adjustIndicatorValue.adjustValuesByInterval(
      historyIndicatorValues,
      interval,
    );

    // then
    expect(resultIndicatorValues).toEqual(historyIndicatorValues);
  });

  it('Week interval 에 따른 indicatorValue 변환', async () => {
    // given
    const adjustIndicatorValue = new AdjustIndicatorValue();

    const historyIndicatorValues: IndicatorValue[] = mockHistoryIndicatorValues.map((value) => {
      return {
        date: adjustIndicatorValue.formatDateToString(new Date(value.date)),
        value: value.close,
      };
    });

    const interval: Interval = 'week';

    // when
    const resultIndicatorValues: IndicatorValue[] = await adjustIndicatorValue.adjustValuesByInterval(
      historyIndicatorValues,
      interval,
    );

    // then
    const expectedIndicatorValues = [
      {
        date: '20240226',
        value: '72800.00',
      },
      {
        date: '20240223',
        value: '73220.00',
      },
      {
        date: '20240216',
        value: '73750.00',
      },
      {
        date: '20240208',
        value: '74450.00',
      },
      {
        date: '20240202',
        value: '74040.00',
      },
      {
        date: '20240126',
        value: '74360.00',
      },
      {
        date: '20240119',
        value: '72780.00',
      },
      {
        date: '20240112',
        value: '74220.00',
      },
      {
        date: '20240105',
        value: '77450.00',
      },
      {
        date: '20231228',
        value: '77700.00',
      },
    ];
    expect(resultIndicatorValues).toEqual(expectedIndicatorValues);
  });

  it('Month interval 에 따른 indicatorValue 변환', async () => {
    // given
    const adjustIndicatorValue = new AdjustIndicatorValue();

    const historyIndicatorValues: IndicatorValue[] = mockHistoryIndicatorValues.map((value) => {
      return {
        date: adjustIndicatorValue.formatDateToString(new Date(value.date)),
        value: value.close,
      };
    });

    const interval: Interval = 'month';

    // when
    const resultIndicatorValues: IndicatorValue[] = await adjustIndicatorValue.adjustValuesByInterval(
      historyIndicatorValues,
      interval,
    );

    // then
    const expectedIndicatorValues = [
      {
        date: '20240226',
        value: '73781.25',
      },
      {
        date: '20240131',
        value: '74454.55',
      },
      {
        date: '20231228',
        value: '77700.00',
      },
    ];
    expect(resultIndicatorValues).toEqual(expectedIndicatorValues);
  });

  it('Year interval 에 따른 indicatorValue 변환', async () => {
    // given
    const adjustIndicatorValue = new AdjustIndicatorValue();

    const historyIndicatorValues: IndicatorValue[] = mockHistoryIndicatorValues.map((value) => {
      return {
        date: adjustIndicatorValue.formatDateToString(new Date(value.date)),
        value: value.close,
      };
    });

    const interval: Interval = 'year';

    // when
    const resultIndicatorValues: IndicatorValue[] = await adjustIndicatorValue.adjustValuesByInterval(
      historyIndicatorValues,
      interval,
    );

    // then
    const expectedIndicatorValues = [
      {
        date: '20240226',
        value: '74171.05',
      },
      {
        date: '20231228',
        value: '77700.00',
      },
    ];
    expect(resultIndicatorValues).toEqual(expectedIndicatorValues);
  });
});
