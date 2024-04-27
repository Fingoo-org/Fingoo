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
      name: 'get_current_weather',
      description: 'Get the current weather',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The city and state, e.g. San Francisco, CA',
          },
          format: {
            type: 'string',
            enum: ['celsius', 'fahrenheit'],
            description: 'The temperature unit to use. Infer this from the users location.',
          },
        },
        required: ['location', 'format'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_stock_price',
      description: 'Get the current stock price',
      parameters: {
        type: 'object',
        properties: {
          ticker: {
            type: 'string',
            description: 'stock ticker symbol, e.g. AAPL',
          },
        },
        required: ['ticker'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'foreacst_stock_price',
      description: 'Get the foreacst stock price',
      parameters: {
        type: 'object',
        properties: {
          target_ticker: {
            type: 'string',
            description: 'target stock ticker to forecast, e.g. AAPL',
          },
          source_tickers: {
            type: 'string',
            description: 'Stock tickers needed for prediction, e.g. MSFT',
          },
        },
        required: ['target_ticker', 'source_tickers'],
      },
    },
  },
];

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'system',
        content:
          "Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous.",
      },
      ...messages,
    ],
    tools: functions,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    experimental_onToolCall: async (toolCallPayload, appendToolCallMessage) => {
      console.log('toolCallPayload', toolCallPayload);
      const { name, arguments: args } = toolCallPayload.tools[0].func;

      if (name === 'get_current_weather') {
        // Call a weather API here
        const weatherData = {
          temperature: 20,
          unit: args.format === 'celsius' ? 'C' : 'F',
        };

        await sleep(3000);

        // `createFunctionCallMessages` constructs the relevant "assistant" and "function" messages for you
        const newMessages = appendToolCallMessage({
          tool_call_id: toolCallPayload.tools[0].id,
          function_name: name,
          tool_call_result: weatherData,
        });

        // return openai.chat.completions.create({
        //   messages: [...messages, ...newMessages],
        //   stream: true,
        //   model: 'gpt-3.5-turbo-0613',
        //   // see "Recursive Function Calls" below
        //   tools: functions,
        // });

        // 이라면 client에서 처리
        return undefined;
      }
      return undefined;
    },
  });
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
