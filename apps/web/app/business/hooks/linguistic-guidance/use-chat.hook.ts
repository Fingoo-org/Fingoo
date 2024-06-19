'use client';
import { useContext } from 'react';
import { ChatContext } from './provider/chat-provider';

export function useChat() {
  const chat = useContext(ChatContext);
  console.log('chat', chat);
  if (!chat) {
    if (process.env.NODE_ENV === 'test') {
      return {
        append: () => {},
      };
    }
    throw new Error('useChat must be used within a ChatProvider');
  }
  return chat;
}
