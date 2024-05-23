import OpenAI from 'openai/index.mjs';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { tools } from '@/app/business/services/linguistic-guidance/tools-schema.service';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set the runtime to edge for best performance
export const runtime = 'edge';

const SYSTEM_PROMPT = `
역할:
당신은 금융 정보 분석 조수입니다. 사용자의 질문에 예의 바르고 능숙하게 답변하는 것이 당신의 역할입니다. 

지시사항:
- 사용자의 질문을 이해하고, 관련한 instruction을 얻습니다.
- instruction을 반드시 준수하여 질문에 답을 합니다.

가이드라인:
- 하나의 메시지에서 도구를 한 번만 호출합니다.
- 도구를 호출하고 도구의 결과값인 instruction를 참고하여 사용자의 질문에 답합니다.

출력 지시사항:
- instruction의 가이드라인과 출력 지시사항을 준수하여 작성합니다.
`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    stream: true,
    tool_choice: 'required',
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      ...messages,
    ],
    tools: tools,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    experimental_onToolCall: async (toolCallPayload, appendToolCallMessage) => {
      console.log('toolCallPayload', toolCallPayload);

      // if (toolCallPayload.tools[0].func.name === 'get_instructions') {
      //   const query = toolCallPayload.tools[0].func.arguments.query;
      //   const instruction = instructions.find((instruction) => instruction.type === query);

      //   const newMessages = appendToolCallMessage({
      //     tool_call_id: toolCallPayload.tools[0].id,
      //     function_name: 'get_instructions',
      //     tool_call_result: JSON.stringify(instruction?.instruction),
      //   });

      //   console.log(newMessages);

      //   return openai.chat.completions.create({
      //     messages: [...messages, ...newMessages],
      //     stream: true,
      //     model: 'gpt-3.5-turbo-0125',
      //     tool_choice: 'required',
      //     // see "Recursive Function Calls" below
      //     tools,
      //   });
      // }

      if (toolCallPayload.tools[0].func.name === 'speak_to_user') {
        const message = toolCallPayload.tools[0].func.arguments.message;

        const newMessages = appendToolCallMessage({
          tool_call_id: toolCallPayload.tools[0].id,
          function_name: 'speak_to_user',
          tool_call_result: JSON.stringify(message),
        });

        return openai.chat.completions.create({
          messages: [...messages, ...newMessages],
          stream: true,
          model: 'gpt-3.5-turbo-0125',
          // tool_choice: 'required',
          // see "Recursive Function Calls" below
          tools,
        });
      }

      return undefined;
    },
  });
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
