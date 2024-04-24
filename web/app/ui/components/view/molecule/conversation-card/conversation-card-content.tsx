import React, { useState, useEffect } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Message, MessageProps } from '../../atom/message';

type ConverationCardProps = {
  initContent?: MessageProps[];
};
const ConversationCardContent = ({ initContent = [] }: ConverationCardProps) => {
  const [contents, setContents] = useState<MessageProps[]>(initContent);

  useEffect(() => {
    setContents(initContent);
  }, [initContent]);

  return (
    <Collapsible.Content className=" h-96 overflow-scroll rounded-b-xl border bg-white">
      <div className="space-y-3 p-3">
        {contents.map((content, index) => (
          <Message key={index} role={content.role} text={content.text} />
        ))}
      </div>
    </Collapsible.Content>
  );
};

export default ConversationCardContent;
