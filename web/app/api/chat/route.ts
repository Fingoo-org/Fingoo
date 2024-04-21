import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import type { ChatCompletionTool } from 'openai/resources/index.mjs';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
];

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages,
    tools: functions,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    experimental_onToolCall: async (toolCallPayload, appendToolCallMessage) => {
      console.log('toolCallPayload', toolCallPayload);
      const { name, arguments: args } = toolCallPayload.tools[0].func;

      if (name === 'get_current_weather') {
        // Call a weather API here
        // const weatherData = {
        //   temperature: 20,
        //   unit: args.format === 'celsius' ? 'C' : 'F',
        // };

        // // `createFunctionCallMessages` constructs the relevant "assistant" and "function" messages for you
        // const newMessages = appendToolCallMessage({
        //   tool_call_id: toolCallPayload.tools[0].id,
        //   function_name: name,
        //   tool_call_result: weatherData,
        // });

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
    },
  });
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
