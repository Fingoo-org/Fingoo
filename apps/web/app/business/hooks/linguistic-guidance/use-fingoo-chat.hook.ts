import { useChat } from 'ai/react';
import { API_PATH } from '@/app/store/querys/api-path';
import { IndicatorByTypeResponse } from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { createIndicator } from '@/app/business/services/numerical-guidance/view-model/indicator-list/indicator-view-model.service';
import {
  updateSourceIndicatorRequestBody,
  useRevalidateCustomForecastIndicatorList,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { generateId, type ChatRequest, type ToolCallHandler } from 'ai';
import { instance } from '@/app/utils/http';
import { useSelectedIndicatorBoardMetadata } from '../numerical-guidance/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useCustomForecastIndicatorListViewModel } from '../numerical-guidance/custom-forecast-indicator/use-custom-forecast-indicator-list-view-model.hook';

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

export const useFingooChat = () => {
  const revalidateCustomForecastIndicatorList = useRevalidateCustomForecastIndicatorList();
  const { addCustomForecastIndicatorToMetadata } = useSelectedIndicatorBoardMetadata();
  const { createCustomForecastIndicator } = useCustomForecastIndicatorListViewModel();
  
  const toolCallHandler: ToolCallHandler = async (chatMessages, toolCalls) => {
    console.log('client');
    console.log('chatMessages:', chatMessages);
    console.log('toolCalls:', toolCalls);
    const functionCall = toolCalls[0].function;

    if (functionCall.name === 'predict_economic_indicator') {
      const parsedFunctionCallArguments = JSON.parse(functionCall.arguments);

      const { target_symbol, source_symbols } = parsedFunctionCallArguments as {
        target_symbol: string;
        source_symbols: string[];
      };
      console.log(target_symbol, source_symbols);

      // 1: id랑 type을 가져온다.
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
      const functionResponse: ChatRequest = {
        messages: [
          ...chatMessages,
          {
            id: generateId(),
            tool_call_id: toolCalls[0].id,
            name: 'predict_economic_indicator',
            role: 'tool' as const,
            content: JSON.stringify({
              predictedEconomicIndicatorValues,
            }),
          },
        ],
      };
      return functionResponse;
    }
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    experimental_onToolCall: toolCallHandler,
    onFinish: (message) => {
      console.log('finished', message);
    },
    onResponse: (response) => {
      console.log('response', response);
    },
  });

  return {
    messages,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
  };
};
