'use client';
import { generateId, type ChatRequest, type FunctionCallHandler, type ToolCallHandler } from 'ai';

const toolCallHandler: ToolCallHandler = async (chatMessages, toolCalls) => {
  console.log('client');
  console.log('chatMessages:', chatMessages);
  console.log('toolCalls:', toolCalls);
  const functionCall = toolCalls[0].function;
  if (functionCall.name === 'get_current_weather') {
    if (functionCall.arguments) {
      const parsedFunctionCallArguments = JSON.parse(functionCall.arguments);
      console.log(parsedFunctionCallArguments);
    }

    // Generate a fake temperature
    const temperature = Math.floor(Math.random() * (100 - 30 + 1) + 30);
    const weather = ['sunny', 'cloudy', 'rainy', 'snowy'][Math.floor(Math.random() * 4)];

    const functionResponse: ChatRequest = {
      messages: [
        ...chatMessages,
        {
          id: generateId(),
          tool_call_id: toolCalls[0].id,
          name: 'get_current_weather',
          role: 'tool' as const,
          content: JSON.stringify({
            temperature,
            weather,
            info: 'This data is randomly generated and came from a fake weather API!',
          }),
        },
      ],
    };
    return functionResponse;
  }

  if (functionCall.name === 'get_stock_price') {
    if (functionCall.arguments) {
      const parsedFunctionCallArguments = JSON.parse(functionCall.arguments);
      console.log(parsedFunctionCallArguments);
    }

    // Generate a fake price
    const price = Math.floor(Math.random() * (100 - 30 + 1) + 30) * 100;

    const functionResponse: ChatRequest = {
      messages: [
        ...chatMessages,
        {
          id: generateId(),
          tool_call_id: toolCalls[0].id,
          name: 'get_current_weather',
          role: 'tool' as const,
          content: JSON.stringify({
            price,
            info: 'This data is randomly generated and came from a fake stock price API!',
          }),
        },
      ],
    };
    return functionResponse;
  }
};

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    experimental_onToolCall: toolCallHandler,
    onFinish: (message) => {
      console.log('finished', message);
    },
    onResponse: (response) => {
      console.log('response', response);
    },
  });

  console.log('messages', messages);

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
