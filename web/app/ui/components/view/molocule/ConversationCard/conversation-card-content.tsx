import React, { useState, useEffect } from 'react';

interface ConverationCardProps {
  initContent?: string[];
}

const ConversationCardContent = ({ initContent = [] }: ConverationCardProps) => {
  const [contents, setContents] = useState<string[]>(initContent);

  useEffect(() => {
    setContents(initContent);
  }, [initContent]);

  return (
    <div className="card-content">
      {contents.map((content, index) => (
        <p key={index}>{content}</p>
      ))}
    </div>
  );
};

export default ConversationCardContent;
