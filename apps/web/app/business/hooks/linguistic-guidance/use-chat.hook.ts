import { useContext } from 'react';
import { ChatContext } from './provider/chat-provider';
import { UseChatHelpers } from 'ai/react';

type Mock = {
  append: () => void;
  messages: [];
  input: '';
  setInput: () => void;
  handleInputChange: () => void;
  handleSubmit: () => void;
  isLoading: false;
};

export function useChat(): UseChatHelpers | Mock {
  const chat = useContext(ChatContext);
  if (!chat) {
    if (process.env.NODE_ENV === 'test') {
      return {
        append: () => {},
        messages: [],
        input: '',
        setInput: () => {},
        handleInputChange: () => {},
        handleSubmit: () => {},
        isLoading: false,
      };
    }
    throw new Error('useChat must be used within a ChatProvider');
  }
  return chat;
}
