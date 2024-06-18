import { useChat } from 'ai/react';
import { generateId, type ChatRequest, type ToolCallHandler } from 'ai';
import usePredictIndicator from './use-prdict-indicator.hook';

const instructions = [
  {
    type: 'predict',
    instruction: `
    경제 지표에 대한 예측을 수행한 후 결과에 대한 해석을 제공합니다. 

    지시사항: 
    - 가능한 경제 지표 분류에는 주식, 환율, 크립토, ETF, 지수, 펀드, 채권이 포함됩니다. 
    - 경제 지표 예측에는 예측하고 싶은 목표 지표와 해당 지표를 예측하기 위한 재료 지표들이 필요합니다. 
    - 재료 지표는 목표 지표와 연관성이 있는 지표로, 사용자에게 묻지 않고 GPT가 알고 있는 지식을 기반으로 제공합니다. 재료 지표는 최소 2개에서 최대 5개까지 제공해야 합니다. 
    - 목표 지표는 재료 지표가 될 수 없습니다. 
    - 반드시 지표의 심볼만 함수의 인자 값으로 전달해야 합니다.(예시: 005930, EUR/USD, BTC/USD, SPY, IXIC, 0P00000AMG 등) 
    - 심볼에는 '.'d이나 '^' 와 같은 접미사나 접두사를 붙이지 않습니다(예시: GSPC). - 크립토와 환율의 심볼은 '/'를 사용합니다(예시: EUR/USD, BTC/USD 등). 
    - 함수의 결과로 예측 결과 값이 제공되면, 예측 결과에 대한 해석을 추가하여 사용자에게 전달해야 합니다. 
    
    가이드라인: - 목표 지표와 재료 지표가 무엇인지 명확히 설명해야 합니다. 
    - 예측 결과 값을 제공해야 합니다. 
    - 해석에는 목표 지표와 재료 지표의 연관성에 대한 지식을 설명해야 합니다. 
    - 예측 결과 값을 기반으로 해당 지표가 상승하는지 하락하는지에 대한 해석을 제공 합니다. 
    - 예측 결과 값을 기반으로 GPT가 알고 있는 지식을 활용하여 해석을 제공 합니다. 
    - 예측 결과 값이 부정확할 수 있음을 설명해야 합니다.
    `,
  },
  {
    type: 'analyze',
    instruction: `
    경제 분석에 필요한 지표들을 가져온 후 이를 토대로 경제 분석을 수행합니다.  
    - 지표는 FRED(Federal Reserve Economic Data) API를 통해 제공되며, FRED의 심볼을 기준으로 제공합니다. 
    `,
  },
  {
    type: 'explain',
    instruction: `
    사용자가 질문한 경제 지표에 대한 정보를 사용자에게 설명합니다.
    
    - 사용자가 질문한 지표에 대한 정보를 제공합니다.
    `,
  },
  {
    type: 'recommend',
    instruction: `
    사용자에게 현재 상황에 맞는 경제 지표를 추천합니다.
        `,
  },
];

export const useFingooChat = () => {
  const { predictEconomicIndicatorHandler } = usePredictIndicator();

  const toolCallHandler: ToolCallHandler = async (chatMessages, toolCalls) => {
    console.log('client');
    console.log('chatMessages:', chatMessages);
    console.log('toolCalls:', toolCalls);
    const functionCall = toolCalls[0].function;

    let content: string | undefined;

    if (functionCall.name === 'get_instructions') {
      const parsedFunctionCallArguments = JSON.parse(functionCall.arguments);

      const { query } = parsedFunctionCallArguments as {
        query: string;
      };
      const instruction = instructions.find((instruction) => instruction.type === query);

      const functionResponse: ChatRequest = {
        messages: [
          ...chatMessages,
          {
            id: generateId(),
            tool_call_id: toolCalls[0].id,
            name: 'get_instructions',
            role: 'tool' as const,
            content: JSON.stringify({
              instruction: instruction?.instruction,
            }),
          },
        ],
      };
      return functionResponse;
    }

    // if (functionCall.name === 'retrive_economic_indicators') {
    //   const parsedFunctionCallArguments = JSON.parse(functionCall.arguments);

    //   console.log('retrive_economic_indicators', parsedFunctionCallArguments);

    //   const { symbols } = parsedFunctionCallArguments as {
    //     symbols: string[];
    //   };

    //   // 1. symbol을 이용하여 indicatorId를 가져온다(동적 저장소)
    //   // 2. 메타데이터 생성
    //   // 3. 메타데이터에 지표 추가
    //   // 4. 지표 값 가져오기(cache로 데이터 가져오기?)
    //   // 5. 분석 값 넣기
    //   // 6. 분석에 대한 해석 제공
    // }

    if (functionCall.name === 'explain_economic_indicator') {
      const parsedFunctionCallArguments = JSON.parse(functionCall.arguments);

      const { symbol } = parsedFunctionCallArguments as {
        symbol: string;
      };

      const functionResponse: ChatRequest = {
        messages: [
          ...chatMessages,
          {
            id: generateId(),
            tool_call_id: toolCalls[0].id,
            name: 'get_instructions',
            role: 'tool' as const,
            content: JSON.stringify(
              `
              ${symbol}에 대한 정보를 설명합니다.

              - 5살짜리도 이해할 수 있도록 쉽고 자세히 설명해야 합니다.
              - 지표의 의미와 중요성을 설명해야 합니다.
              - 지표의 특징과 활용 방법을 설명해야 합니다.
              `,
            ),
          },
        ],
      };
      return functionResponse;
    }

    if (functionCall.name === 'analyze_economic_indicators') {
      const parsedFunctionCallArguments = JSON.parse(functionCall.arguments);

      const { symbols } = parsedFunctionCallArguments as {
        symbols: string[];
      };

      const functionResponse: ChatRequest = {
        messages: [
          ...chatMessages,
          {
            id: generateId(),
            tool_call_id: toolCalls[0].id,
            name: 'analyze_economic_indicator',
            role: 'tool' as const,
            content: JSON.stringify(
              `
                관련 분석 심볼: ${symbols}
                
                - 관련있는 지표를 왜 해당 지표가 질문과 관련있는지 설명해야합니다.
                - 지표를 중심으로 전체적인 흐름과 상황을 분석해주어야합니다.
                
              `,
            ),
          },
        ],
      };
      return functionResponse;
    }

    if (functionCall.name === 'predict_economic_indicator') {
      content = await predictEconomicIndicatorHandler(
        JSON.parse(functionCall.arguments) as {
          target_symbol: string;
          source_symbols: string[];
        },
      );
    }

    if (functionCall.name === 'recommend_economic_indicator') {
      const parsedFunctionCallArguments = JSON.parse(functionCall.arguments);

      const { symbols } = parsedFunctionCallArguments as {
        symbols: string[];
      };

      const functionResponse: ChatRequest = {
        messages: [
          ...chatMessages,
          {
            id: generateId(),
            tool_call_id: toolCalls[0].id,
            name: 'analyze_economic_indicator',
            role: 'tool' as const,
            content: JSON.stringify(
              `
                추천 심볼 리스트: ${symbols}
                
                - 왜 해당 심볼을 추천하는지에 대한 이유를 설명해야합니다.
                
              `,
            ),
          },
        ],
      };
      return functionResponse;
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
