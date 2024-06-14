import { cn } from '@/app/utils/style';

export type MessageProps = {
  role: 'function' | 'user' | 'assistant' | 'system' | 'data' | 'tool';
  content: React.ReactNode;
};

export const MessageItem = ({ role, content }: MessageProps) => {
  return (
    <div
      className={cn('flex h-auto flex-col-reverse whitespace-pre-wrap ', {
        'items-end justify-end': role === 'user',
        'items-start justify-start': role !== 'user',
      })}
    >
      <div
        className={cn('flex w-auto max-w-64 rounded-lg bg-white px-5 py-3 text-black 		', {
          'justify-end bg-black text-right text-white ': role === 'user',
          'justify-start drop-shadow-[0_0_3px_rgba(0,0,0,0.2)]': role !== 'user',
        })}
      >
        <div className="flex font-pretendard text-sm font-semibold">{content}</div>
      </div>
    </div>
  );
};
