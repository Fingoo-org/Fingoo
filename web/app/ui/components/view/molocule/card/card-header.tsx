import React from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import IconButton from '../../atom/icons/icon-button';

type CardHeaderProps = {
  title: string;
  firstIcon?: React.ElementType;
  secondIcon?: React.ElementType;
} & React.HTMLAttributes<HTMLDivElement>;

const CardHeader = ({ title, firstIcon, secondIcon, ...props }: CardHeaderProps) => {
  return (
    <div
      className="flex items-center justify-between rounded-t-xl bg-black px-5 text-xl font-semibold text-white"
      {...props}
    >
      {firstIcon ? <IconButton size="xl" icon={firstIcon} color="white" /> : null}
      <div className="flex-grow text-center">{title}</div>
      <Collapsible.Trigger asChild>
        {secondIcon ? <IconButton size="xl" icon={secondIcon} color="white" /> : null}
      </Collapsible.Trigger>
    </div>
  );
};

export default CardHeader;
