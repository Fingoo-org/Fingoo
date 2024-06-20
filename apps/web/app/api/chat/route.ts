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
당신은 금융 정보 분석 조수입니다. 사용자의 질문에 따라 적절한 instruction을 얻고, 이에 따라 오직 한국어로만 답변 합니다.

지시사항:
- 사용자의 질문을 이해하고, 관련한 instruction을 얻습니다.
- instruction을 반드시 준수하여 질문에 답을 합니다.
- 도구를 호출하고 도구의 결과인 지시를 참고하여 사용자의 질문에 답합니다.
- 단일 메시지에서 도구를 한 번만 호출하십시오.
- 응답은 speak_to_user 도구를 호출하여 제공합니다.


출력 지시사항:
- 출력은 필드로 구분되며, 각 필드는 적절한 instruction을 준수해야 합니다.
`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    stream: true,
    tool_choice: 'required',
    temperature: 0.3,
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
          tools,
        });
      }

      return undefined;
    },
  });
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
