import { CollapsibleContent } from '@radix-ui/react-collapsible';
import React, { useState, useEffect } from 'react';

type ConverationCardProps = {
  initContent?: string[];
};

const ConversationCardContent = ({ initContent = [] }: ConverationCardProps) => {
  const [contents, setContents] = useState<string[]>(initContent);

  useEffect(() => {
    setContents(initContent);
  }, [initContent]);

  return (
    <CollapsibleContent className=" h-96 rounded-b-xl border bg-white">
      {contents.map((content, index) => (
        <p key={index}>{content}</p>
      ))}
    </CollapsibleContent>
  );
};

export default ConversationCardContent;
