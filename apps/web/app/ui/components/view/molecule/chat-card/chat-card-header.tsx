import React from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import IconButton from '../../atom/icons/icon-button';

type ChatCardHeaderProps = {
  title: string;
  infoIcon?: React.ElementType;
  collapsibleIcon?: React.ElementType;
} & React.HTMLAttributes<HTMLDivElement>;

const ChatCardHeader = ({ title, infoIcon, collapsibleIcon, ...props }: ChatCardHeaderProps) => {
  return (
    <div
      className="flex h-10 w-full items-center justify-between rounded-t-xl bg-black px-5 text-xl font-semibold text-white"
      {...props}
    >
      {infoIcon ? <IconButton size="xl" icon={infoIcon} color="white" /> : null}
      <div className="flex-grow text-center">{title}</div>
      <Collapsible.Trigger asChild>
        {collapsibleIcon ? <IconButton size="xl" icon={collapsibleIcon} color="white" /> : null}
      </Collapsible.Trigger>
    </div>
  );
};

export default ChatCardHeader;
