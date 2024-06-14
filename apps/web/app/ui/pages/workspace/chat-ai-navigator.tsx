'use client';
import { Sidebar } from 'react-pro-sidebar';
import Chat from '../../components/domain/linguistic-guidance/chat';

export default function ChatAiNavigator() {
  return (
    <Sidebar width="400px" backgroundColor={'#fff'} className="shadow-sm">
      <div className="h-[150px] w-full bg-gray-300"></div>
      <div className="h-8 w-full border"></div>
      <div className="px-6">
        <Chat />
      </div>
    </Sidebar>
  );
}
