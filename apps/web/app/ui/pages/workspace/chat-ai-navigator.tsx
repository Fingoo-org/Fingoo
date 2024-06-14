'use client';
import { Sidebar } from 'react-pro-sidebar';
import Chat from '../../components/domain/linguistic-guidance/chat';

export default function ChatAiNavigator() {
  return (
    <Sidebar width="400px" backgroundColor={'#fff'} className="shadow-sm">
      <div className="flex h-full flex-col ">
        <div className="h-[150px] w-full bg-gray-300"></div>
        <div className="h-8 w-full border"></div>
        <div className="grow overflow-y-auto px-6">
          <Chat />
        </div>
      </div>
    </Sidebar>
  );
}
