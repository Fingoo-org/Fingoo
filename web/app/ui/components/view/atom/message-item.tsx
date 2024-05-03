import { cn } from '@/app/utils/style';

export type MessageProps = {
  role: 'function' | 'user' | 'assistant' | 'system' | 'data' | 'tool';
  content: React.ReactNode;
};

export const MessageItem = ({ role, content }: MessageProps) => {
  return (
    <div
      className={cn('flex h-auto flex-col-reverse', {
        'items-end justify-end': role === 'user',
        'items-start justify-start': role !== 'user',
      })}
    >
      <div
        className={cn('flex w-auto max-w-64 rounded-lg p-2', {
          'justify-end bg-[#333333] text-right text-white': role === 'user',
          'justify-start bg-[#f1f1f1] text-black': role !== 'user',
        })}
      >
        <div className="flex font-pretendard text-xs font-semibold">{content}</div>
      </div>
    </div>
  );
};
