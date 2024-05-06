import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import type { ChatCompletionTool } from 'openai/resources/index.mjs';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// Set the runtime to edge for best performance
export const runtime = 'edge';

const functions: Array<ChatCompletionTool> = [
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
            description: '예측할 목표 경제 지표의 심볼',
          },
          source_symbols: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: '재료 지표의 심볼 리스트',
          },
        },
        required: ['target_symbol', 'source_symbols'],
      },
    },
  },
];

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `
        역할:
        경제 지표의 예측 및 해석 역할을 수행합니다.
        
        상황:
        - 사용자가 특정 경제 지표에 대한 예측 결과를 알고 싶어합니다.
        
        입력값:
        - 사용자가 예측하고 싶은 경제 지표
        
        지시사항:
        - 가능한 경제 지표 분류에는 주식, 환율, 크립토, ETF, 지수, 펀드, 채권이 포함됩니다.
        - 경제 지표 예측에는 예측하고 싶은 목표 지표와 해당 지표를 예측하기 위한 재료 지표들이 필요합니다.
        - 재료 지표는 목표 지표와 연관성이 있는 지표로, 사용자에게 묻지 않고 GPT가 알고 있는 지식을 기반으로 제공합니다. 재료 지표는 최소 2개에서 최대 5개까지 제공해야 합니다.
        - 목표 지표는 재료 지표가 될 수 없습니다.
        - 반드시 지표의 심볼만 함수의 인자 값으로 전달해야 합니다.(예시: 005930, EUR/USD, BTC/USD, SPY, IXIC, 0P00000AMG 등)
        - 심볼에는 '.'d이나 '^' 와 같은 접미사나 접두사를 붙이지 않습니다(예시: GSPC). 
        - 크립토와 환율의 심볼은 '/'를 사용합니다(예시: EUR/USD, BTC/USD 등).
        - 함수의 결과로 예측 결과 값이 제공되면, 예측 결과에 대한 해석을 추가하여 사용자에게 전달해야 합니다.
        
        가이드라인:
        - 목표 지표와 재료 지표가 무엇인지 명확히 설명해야 합니다.
        - 예측 결과 값을 제공해야 합니다.
        - 예측 결과에 대한 GPT만의 해석을 제공해야 합니다.
        - 예측 결과 값이 부정확할 수 있음을 설명해야 합니다.
        
        출력 지시사항:
        - 출력필드:
        필드 1: 목표 및 재료 지표
        필드 2: 예측 결과 값
        필드 3: 예측에 대한 해석`,
      },
      ...messages,
    ],
    tools: functions,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    experimental_onToolCall: async (toolCallPayload, appendToolCallMessage) => {
      console.log('toolCallPayload', toolCallPayload);

      return undefined;
    },
  });
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
