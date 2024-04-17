import React, { useState, useEffect } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';

type ConverationCardProps = {
  initContent?: string[];
};

const ConversationCardContent = ({ initContent = [] }: ConverationCardProps) => {
  const [contents, setContents] = useState<string[]>(initContent);

  useEffect(() => {
    setContents(initContent);
  }, [initContent]);

  return (
    <Collapsible.Content className=" h-96 rounded-b-xl border bg-white">
      {contents.map((content, index) => (
        <p key={index}>{content}</p>
      ))}
    </Collapsible.Content>
  );
};

export default ConversationCardContent;
