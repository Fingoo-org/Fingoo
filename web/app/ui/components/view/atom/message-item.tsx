export type MessageProps = {
  role: 'function' | 'user' | 'assistant' | 'system' | 'data' | 'tool';
  content: React.ReactNode;
};

export const MessageItem = ({ role, content }: MessageProps) => {
  return (
    <div
      className={` flex h-auto flex-col-reverse ${role === 'user' ? `items-end justify-end` : `items-start justify-start`}`}
    >
      <div
        className={`flex w-auto max-w-64 rounded-lg p-3 ${
          role === 'user' ? `justify-end bg-[#333333] text-right text-white` : `justify-start bg-[#f1f1f1] text-black`
        }`}
      >
        <div className="flex font-pretendard text-sm font-light">{content}</div>
      </div>
    </div>
  );
};
