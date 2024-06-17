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
      name: 'analyze_economic_indicators',
      description: '경제 현황을 분석하기 위한 지표들에 대한 값을 가져온다.',
      parameters: {
        type: 'object',
        properties: {
          symbols: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: '경제 현황 분석에 필요한 지표들의 심볼 리스트',
          },
        },
        required: ['symbols'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'explain_economic_indicator',
      description: '사용자가 질문한 경제 지표에 대한 설명을 사용자에게 제공한다.',
      parameters: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description: '사용자가 질문한 경제 지표',
          },
        },
        required: ['symbol'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'recommend_economic_indicator',
      description: '사용자에게 경제 지표를 추천한다.',
      parameters: {
        type: 'object',
        properties: {
          symbols: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: '사용자에게 추천하는 경제 지표 리스트',
          },
        },
        required: ['symbols'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'speak_to_user',
      // description: '도구 응답 지시사항을 준수하여 사용자의 질문에 대답합니다.',
      description: 'properties의 message description에 명시된 출력 필드를 반드시 구분하여 사용자의 질문에 대답합니다.',
      parameters: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: ` 사용자에게 전달할 메세지 입니다. 사용자의 질문 타입에 따라 출력 필드를 구분하여 메시지를 제공합니다. 
            - predict 출력 필드: 
            출력 필드 1: 목표지표에 대해 설명(예시: (목표지표-AMZN: nasdaq에 상장된 IT기업 아마존))
            출력 필드 2: 재료지표 이름(심볼명) (예시: 재료지표: Apple주식(AAPL), 비트코인/달러환율(BTC/USD))
            출력 필드 3: 예측 결과 현재날짜 기준 +10일까지 범위의 일 단위 값 표현  (예시: 2024년 06월 01일: 600 \n2024년 06월 02일: 700)
            출력 필드 4: 사용한 재료 지표에 대해 각각 설명(예시: ([s&p500, AAPL] - s&p500: 미국에 상장된 시가총액 상위 500개의 주식을 모아 지수로 묶은 것, AAPL: 미국의 IT기업 애플의 주식입니다.))
            출력 필드 5: 목표지표 예측에 해당 재료지표를 사용한 이유 설명
            출력 필드 6: 예측 결과에 대한 해석
            - explain:
            필드 1: 경제 지표에 대한 설명
            필드 2: 관련된 지표에 대한 설명
            필드 3: 경제 지표의 의미와 중요성
            - anaylize:
            출력 필드 1: 관련된 지표에 대한 설명
            출력 필드 2: 해당 지표와 질문과의 관련성 설명
            출력 필드 3: 분석 결과에 대한 해석
            -recommend:
            출력 필드 1: 추천 지표에 대한 설명
            출력 필드 2: 추천 지표를 왜 추천했는가에 대한 이유 설명
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
            enum: ['predict', 'analyze', 'explain', 'recommend'],
            description: `""사용자가 하는 질문의 타입은 다음 중 하나가 될 수 있다:
            - predict: 경제 지표 예측과 해석을 요청하는 질문.""
            - analyze: 시장 상황이나 지수와 같은 종합적인 경제 상황에 대한 분석을 요청하는 질문(예시: IT시장 상황을 분석해줘)
            - explain: 특정 단일 지표에 대한 설명이나 분석을 요청하는 질문 (예시: 월마트의 현재 상황을 분석해줘, WMT분석해줘)
            - recommend: 유망한 경제 지표를 추천받는 질문 (예시: 현재 은행관련 괜찮은 주식이 있을까?)
            `,
          },
        },
        required: ['query'],
      },
    },
  },
];
