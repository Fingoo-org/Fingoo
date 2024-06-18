import { instance } from '@/app/utils/http';
import { createIndicator } from '../../services/numerical-guidance/view-model/indicator-list/indicator-view-model.service';
import { IndicatorByTypeResponse } from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { API_PATH } from '@/app/store/querys/api-path';
import { useCustomForecastIndicatorListViewModel } from '../numerical-guidance/custom-forecast-indicator/use-custom-forecast-indicator-list-view-model.hook';
import {
  updateSourceIndicatorRequestBody,
  useRevalidateCustomForecastIndicatorList,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { useSelectedIndicatorBoardMetadata } from '../numerical-guidance/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';

async function getIndicatorIdBySymbol(symbol: string): Promise<IndicatorByTypeResponse> {
  const { data } = await instance.get(`${API_PATH.indicatorList}/search`, {
    params: {
      symbol,
      type: 'none',
    },
  });
  return data;
}

function formatSymbol(symbol: string) {
  if (symbol.includes(':')) {
    return symbol.split(':')[1];
  }
  if (symbol.includes('^')) {
    return symbol.split('^')[1];
  }
  if (symbol.includes('.')) {
    return symbol.split('.')[0];
  }
  return symbol;
}

type Props = {
  target_symbol: string;
  source_symbols: string[];
};

export default function usePredictIndicator() {
  const { createCustomForecastIndicator } = useCustomForecastIndicatorListViewModel();
  const revalidateCustomForecastIndicatorList = useRevalidateCustomForecastIndicatorList();
  const { addCustomForecastIndicatorToMetadata } = useSelectedIndicatorBoardMetadata();

  async function predictEconomicIndicatorHandler({ target_symbol, source_symbols }: Props) {
    const target_indicator = createIndicator(await getIndicatorIdBySymbol(formatSymbol(target_symbol)));

    const source_indicators = (
      await Promise.all(
        source_symbols.map(async (source_symbol) => {
          try {
            return createIndicator(await getIndicatorIdBySymbol(formatSymbol(source_symbol)));
          } catch {
            return;
          }
        }),
      )
    ).filter((indicator) => indicator !== undefined);

    console.log('target_indicator:', target_indicator);
    console.log('source_indicators:', source_indicators);

    // 2: 예측지표를 생성한다
    const custonforecastIndicatorId = await createCustomForecastIndicator({
      targetIndicatorId: target_indicator.id,
      indicatorType: target_indicator.indicatorType,
      customForecastIndicatorName: `GPT가 생성한 예측지표(${target_indicator.symbol})`,
    });

    // 3: 예측 지표의 재료 지표를 업데이트 한다.
    const body: updateSourceIndicatorRequestBody = {
      sourceIndicatorsInformation: source_indicators.map((indicator) => ({
        sourceIndicatorId: indicator!.id,
        weight: 0,
        indicatorType: indicator!.indicatorType,
      })),
    };
    await instance.patch(`${API_PATH.customForecastIndicator}/${custonforecastIndicatorId}`, body);
    revalidateCustomForecastIndicatorList();

    addCustomForecastIndicatorToMetadata(custonforecastIndicatorId);
    // 4: 예측 지표 값을 가져온다.
    const { data } = await instance.get(`${API_PATH.customForecastIndicator}/value/${custonforecastIndicatorId}`);

    const predictedEconomicIndicatorValues = data.customForecastIndicatorValues;

    return JSON.stringify(
      `
      에측 결과 값: ${JSON.stringify(predictedEconomicIndicatorValues)}

      아래와 같은 지시사항을 따라 사용자에게 예측 결과값에 대한 해석을 제공합니다.
      - 목표 지표와 재료 지표가 무엇인지 명확히 설명해야 합니다. 
      - 예측 결과 값을 제공해야 합니다. 
      - 해석에는 목표 지표와 재료 지표의 연관성에 대한 지식을 설명해야 합니다. 
      - 예측 결과 값을 기반으로 해당 지표가 상승하는지 하락하는지에 대한 해석을 제공 합니다. 
      - 예측 결과 값을 기반으로 GPT가 알고 있는 지식을 활용하여 해석을 제공 합니다. 
      - 예측 결과 값이 부정확할 수 있음을 설명해야 합니다.
      `,
    );
  }

  return {
    predictEconomicIndicatorHandler,
  };
}
