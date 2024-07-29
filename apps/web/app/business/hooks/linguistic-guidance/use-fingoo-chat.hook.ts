import { useChat } from 'ai/react';
import { generateId, type ChatRequest, type ToolCallHandler } from 'ai';
import usePredictIndicator from './use-predict-indicator.hook';
import useInstruction from './use-instruction.hook';
import useAnalyzeEconomy from './use-analyze-economy.hook';
import useRecommendIndicator from './use-recommend-indicator.hook';
import useExplainIndicator from './use-explain-indicator.hook';
import useDrawMetadata from './use-draw-metadata.hook';

//   // 1. symbol을 이용하여 indicatorId를 가져온다(동적 저장소)
//   // 2. 메타데이터 생성
//   // 3. 메타데이터에 지표 추가
//   // 4. 지표 값 가져오기(cache로 데이터 가져오기?)
//   // 5. 분석 값 넣기
//   // 6. 분석에 대한 해석 제공

export const useFingooChat = () => {
  const { predictEconomicIndicatorHandler } = usePredictIndicator();
  const { getInstruction } = useInstruction();
  const { analyzeEconomicHandler } = useAnalyzeEconomy();
  const { recommendIndicatorHandler } = useRecommendIndicator();
  const { handleExplainIndicator } = useExplainIndicator();
  const { drawMetadataHandler } = useDrawMetadata();
  const toolCallHandler: ToolCallHandler = async (chatMessages, toolCalls) => {
    console.log('client');
    console.log('chatMessages:', chatMessages);
    console.log('toolCalls:', toolCalls);
    const functionCall = toolCalls[0].function;

    let content: string | undefined;
    const parsedFunctionCallArguments = JSON.parse(functionCall.arguments);

    if (functionCall.name === 'get_instructions') {
      content = getInstruction(
        parsedFunctionCallArguments as {
          query: string;
        },
      );
    }

    if (functionCall.name === 'predict_economic_indicator') {
      content = await predictEconomicIndicatorHandler(
        parsedFunctionCallArguments as {
          target_symbol: string;
          source_symbols: string[];
        },
      );
    }

    if (functionCall.name === 'analyze_economic_indicators') {
      const { symbols } = parsedFunctionCallArguments as {
        symbols: string[];
      };

      content = await analyzeEconomicHandler(symbols);
    }

    if (functionCall.name === 'explain_economic_indicator') {
      const { symbol } = parsedFunctionCallArguments as {
        symbol: string;
      };

      content = await handleExplainIndicator(symbol);
    }

    if (functionCall.name === 'recommend_economic_indicator') {
      const { symbols } = parsedFunctionCallArguments as {
        symbols: string[];
      };

      content = await recommendIndicatorHandler(symbols);
    }

    if (functionCall.name === 'draw_metadata') {
      const { symbols } = parsedFunctionCallArguments as {
        symbols: string[];
      };
      content = await drawMetadataHandler(symbols);
    }

    const functionResponse: ChatRequest = {
      messages: [
        ...chatMessages,
        {
          id: generateId(),
          tool_call_id: toolCalls[0].id,
          name: functionCall.name,
          role: 'tool' as const,
          content: content ?? '기능이 구현되지 않았습니다.',
        },
      ],
    };
    return functionResponse;
  };

  const { messages, input, handleInputChange, setInput, handleSubmit, append, isLoading, ...rest } = useChat({
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
    setInput,
    append,
    ...rest,
  };
};
