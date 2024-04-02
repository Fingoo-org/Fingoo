import React from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';

type CardContentProps = {
  children: React.ReactNode;
};

const CardContent = ({ children }: CardContentProps) => {
  return (
    <Collapsible.Content className=" h-96 w-full rounded-b-xl border border-black bg-white font-light">
      <p className="p-4">{children}</p>
    </Collapsible.Content>
  );
};

export default CardContent;
