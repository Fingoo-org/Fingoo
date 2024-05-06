'use client';
import { generateId, type ChatRequest, type FunctionCallHandler, type ToolCallHandler } from 'ai';

const toolCallHandler: ToolCallHandler = async (chatMessages, toolCalls) => {
  console.log('client');
  console.log('chatMessages:', chatMessages);
  console.log('toolCalls:', toolCalls);
  const functionCall = toolCalls[0].function;

  if (functionCall.name === 'predict_economic_indicator') {
    if (functionCall.arguments) {
      const parsedFunctionCallArguments = JSON.parse(functionCall.arguments);
      console.log(parsedFunctionCallArguments);
    }

    const functionResponse: ChatRequest = {
      messages: [
        ...chatMessages,
        {
          id: generateId(),
          tool_call_id: toolCalls[0].id,
          name: 'predict_economic_indicator',
          role: 'tool' as const,
          content: JSON.stringify({
            predictedEconomicIndicatorValues: [
              {
                value: 100,
                date: '20240510',
              },
              {
                value: 167.41568388543206,
                date: '20240511',
              },
              {
                value: 143.98269881536103,
                date: '20240512',
              },
              {
                value: 151.14716030892865,
                date: '20240513',
              },
              {
                value: 215.12078847030588,
                date: '20240514',
              },
            ],
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
