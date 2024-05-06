'use client';
import { generateId, type ChatRequest, type FunctionCallHandler, type ToolCallHandler } from 'ai';
import { instance } from '@/app/utils/http';

async function getIndicatorIdBySymbol(symbol: string): Promise<indicatorByTypeResponse> {
  const { data } = await instance.get(`${API_PATH.indicatorList}/search-by-symbol/${symbol}`);
  return data;
}

async function createCustomForecastIndicator(indicator: Indicator) {
  const body: CreateCustomForecastIndicatorRequestBody = {
    customForecastIndicatorName: 'GPT의 예측지표',
    targetIndicatorId: indicator.id,
    targetIndicatorType: indicator.indicatorType,
  };
  const { data: custonforecastIndicatorId } = await instance.post(`${API_PATH.customForecastIndicator}`, body);

  return custonforecastIndicatorId;
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
    const custonforecastIndicatorId = await createCustomForecastIndicator(target_indicator);

    // 3: 예측 지표의 재료 지표를 업데이트 한다.
    const body: updateSourceIndicatorRequestBody = {
      sourceIndicatorsInformation: source_indicators.map((indicator) => ({
        sourceIndicatorId: indicator.id,
        weight: 0,
        indicatorType: indicator.indicatorType,
      })),
    };
    await instance.patch(`${API_PATH.customForecastIndicator}/${custonforecastIndicatorId}`, body);

    // 4: 예측 지표 값을 가져온다.
    const { data } = await instance.get(`${API_PATH.customForecastIndicator}/value/${custonforecastIndicatorId}`);

    const predictedEconomicIndicatorValues = data.customForecastIndicatorValues;
    console.log('predictedEconomicIndicatorValues:', predictedEconomicIndicatorValues);
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

import { useChat } from 'ai/react';
import { API_PATH } from '@/app/store/querys/api-path';
import { indicatorByTypeResponse } from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { createIndicator } from '@/app/business/services/view-model/indicator-list/indicator-view-model.service';
import {
  CreateCustomForecastIndicatorRequestBody,
  updateSourceIndicatorRequestBody,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { Indicator } from '@/app/business/services/view-model/indicator-list/indicators/indicator.service';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    experimental_onToolCall: toolCallHandler,
    onFinish: (message) => {
      console.log('finished', message);
    },
    onResponse: (response) => {
      console.log('response', response);
    },
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
