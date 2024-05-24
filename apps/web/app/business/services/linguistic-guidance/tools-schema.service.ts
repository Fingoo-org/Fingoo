import type { ChatCompletionTool } from 'openai/resources/index.mjs';

export const tools: Array<ChatCompletionTool> = [
  {
    type: 'function',
    function: {
      name: 'predict_economic_indicator',
      description: 'time series 형태의 경제 지표 예측 결과 값을 가져온다',
      parameters: {
        type: 'object',
        properties: {
          target_symbol: {
            type: 'string',
            description: '예측할 목표 경제 지표의 심볼(예시: 005930, EUR/USD, BTC/USD, SPY, IXIC, 0P00000AMG 등)',
          },
          source_symbols: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: '재료 지표의 심볼 리스트(예시: [005930, EUR/USD, BTC/USD, SPY, IXIC, 0P00000AMG])',
          },
        },
        required: ['target_symbol', 'source_symbols'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'speak_to_user',
      description: '도구 응답 지시사항을 준수하여 사용자의 질문에 대답합니다. 대답은 한글로 작성합니다. ',
      parameters: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: ` 사용자에게 전달할 메세지 입니다. 사용자의 질문 타입에 따라 출력 필드를 생성합니다.
            - predict: 
            필드 1: 목표 및 재료 지표 
            필드 2: 예측 결과 값 
            필드 3: 예측에 대한 해석
            .
            `,
          },
        },
        required: ['message'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_instructions',
      description: '사용자 질문에 대한 적절한 instruction을 얻는다.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            enum: ['predict', 'analysis'],
            description: `""사용자가 하는 질문의 타입은 다음 중 하나가 될 수 있다:
            - predict: 경제 지표 예측과 해석을 요청하는 질문.""
            - analysis: 경제 현황에 대한 분석을 요청하는 질문.
            `,
          },
        },
        required: ['query'],
      },
    },
  },
];
