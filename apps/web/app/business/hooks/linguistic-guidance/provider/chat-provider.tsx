import { UseChatHelpers } from 'ai/react';
import { createContext } from 'react';
import { useFingooChat } from '../use-fingoo-chat.hook';

export const ChatContext = createContext<UseChatHelpers | null>(null);

export default function ChatProvider({ children }: { children: React.ReactNode }) {
  return <ChatContext.Provider value={useFingooChat()}>{children}</ChatContext.Provider>;
}
