import type { ChatCompletionTool } from 'openai/resources/index.mjs';

export type FunctionName =
  | 'predict_economic_indicator'
  | 'analyze_economic_indicators'
  | 'explain_economic_indicator'
  | 'recommend_economic_indicator'
  | 'draw_metadata'
  | 'speak_to_user'
  | 'get_instructions';

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
      description: '경제 지표에 대한 정보를 설명한다.',
      parameters: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description: '설명할 경제 지표의 심볼(예시: 005930, EUR/USD, BTC/USD, SPY, IXIC, 0P00000AMG, GSPC 등)',
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
      description:
        'properties의 message description에 명시된 출력 필드를 반드시 구분하고, 출력필드의 내용 그대로 사용자의 질문에 대답합니다. ',
      parameters: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: `사용자에게 전달할 메세지 입니다. 사용자의 질문 타입에 따라 출력 필드를 구분하여 메시지를 제공합니다. 출력필드 내의 내용을 반드시 따라야합니다. 반드시 한국어로 답변해야합니다.

            - predict 출력 필드: 
            출력 필드 1: 목표지표에 대해 설명(예시: (목표지표-AMZN: nasdaq에 상장된 IT기업 아마존))
            출력 필드 2: 재료지표 이름(심볼명) (예시: 재료지표: Apple주식(AAPL), 비트코인/달러환율(BTC/USD))
            출력 필드 3: 예측 결과 현재날짜 기준 +10일까지 범위의 일 단위 값 표현  (예시: 2024년 06월 01일: 600 \n2024년 06월 02일: 700)
            출력 필드 4: 사용한 재료 지표에 대해 각각 설명(예시: ([s&p500, AAPL] - s&p500: 미국에 상장된 시가총액 상위 500개의 주식을 모아 지수로 묶은 것, AAPL: 미국의 IT기업 애플의 주식입니다.))
            출력 필드 5: 목표지표 예측에 해당 재료지표를 사용한 이유 설명
            출력 필드 6: 예측 결과에 대한 해석

            - anaylize 출력 필드:
            연관 지표 설명: 시장이나 지수 분석에 사용한 지표(심볼) 이름과 해당 연관 지표를 선택한 이유 설명 (예시: 코스피지수에서 높은 점유를 가진 삼성전자와 sk하이닉스를 참고하였습니다.)
            연관 지표 추세 분석: 각각의 연관지표 6개월 동안의 대략적인 추세 설명 (예시: 6개월간의 시장 지표 AAPL: 상승 추세,  TSLA: 하락 추세)
            시장 및 지수에 대한 분석: 연관 지표 추세에 따른 종합적인 분석 설명 (연관 지표들의 추세를 통해 해당 시장은 점진적으로 성장한다고 볼 수 있다.)
            추가 참고 지표 추천: 추가적으로 살펴보면 좋을 것 같은 연관 지표가 있다면 해당 지표의 이름(심볼명) 

            - explain 출력필드:
            해당 지표 이름과 심볼: 해당하는 경제 지표에 대한 이름, FRED의 심볼값
            지표 개요 설명: 설명하고자 하는 지표에 대한 개요를 설명합니다.
            연관성 설명: 해당 지표가 시장에서 어떤 위치에 있는지, 어떤 시장과 연관이 있는지를 설명합니다.

            -recommend 출력필드:
            지표 이름과 심볼: 각각의 추천 지표에 대한 이름과 심볼값 명시 (예시: 월마트(WMT))
            개별 지표 개요 설명: 각각의 추천 지표에 대한 개별적인 개요를 설명합니다. (예시: 월마트(Walmart)는 미국의 다국적 소매 기업으로, 전 세계적으로 가장 큰 소매업체 중 하나입니다. 1962년 샘 월튼(Sam Walton)에 의해 설립되었으며, 현재 본사는 아칸소주 벤턴빌에 위치하고 있습니다. 월마트는 다양한 상품을 저렴한 가격에 제공하는 대형 할인 매장으로 유명합니다.)
            연관성 설명: 각각의 추천 지표와 질문과의 연관성을 설명합니다.

            - draw 출력필드:            
            해당 지표 이름과 심볼: 해당하는 경제 지표에 대한 이름, FRED의 심볼값
            지표에 대한 간략한 설명
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
      name: 'draw_metadata',
      description: '사용자가 요청한 경제 지표 리스트를 메타데이터에 그려준다.',
      parameters: {
        type: 'object',
        properties: {
          symbols: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: '사용자가 요청한 경제 지표 리스트',
          },
        },
        required: ['symbols'],
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
            enum: ['predict', 'analyze', 'explain', 'recommend', 'draw'],
            description: `""사용자가 하는 질문의 타입은 다음 중 하나가 될 수 있다:
            - predict: 경제 지표 예측과 해석을 요청하는 질문.""
            - analyze: 시장 상황이나 지수와 같은 종합적인 경제 상황에 대한 분석을 요청하는 질문(예시: IT시장 상황을 분석해줘)
            - explain: 특정 단일 지표에 대한 설명이나 분석을 요청하는 질문 (예시: 월마트의 현재 상황을 분석해줘, WMT분석해줘)
            - recommend: 유망한 경제 지표를 추천받는 질문 (예시: 현재 은행관련 괜찮은 주식이 있을까?)
            - draw: 경제 지표를 메타데이터로 보여주도록 요청하는 질문 (예시: 애플 지표를 보여줘, 애플, 아마존의 지표를 화면에 표시해줘)
            `,
          },
        },
        required: ['query'],
      },
    },
  },
];
