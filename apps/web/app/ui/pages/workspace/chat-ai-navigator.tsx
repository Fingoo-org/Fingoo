'use client';
import { Sidebar } from 'react-pro-sidebar';
import - from '../../components/domain/linguistic-guidance/chat';

export default function ChatAiNavigator() {
  return (
    <Sidebar width="400px" backgroundColor={'#fff'} className="shadow-sm">
      <div className="">
        <div className="h-[13vh] w-full bg-gray-300"></div>
        <div className="h-[3vh] w-full border"></div>
        <div className="h-[84vh]">
          <Chat />
        </div>
      </div>
    </Sidebar>
  );
}
