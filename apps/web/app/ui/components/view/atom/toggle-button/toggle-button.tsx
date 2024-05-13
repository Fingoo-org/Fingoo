'use client';

import { useEffect, useState } from 'react';
import Switch from '../switch';
import { cn } from '@/app/utils/style';

type ToggleButtonProps = {
  text: string;
  disabled?: boolean;
  onToggle?: (active: boolean) => void;
};

export default function ToggleButton({ text, disabled = false, onToggle }: ToggleButtonProps): JSX.Element {
  const [active, setActive] = useState(false);

  useEffect(() => {
    onToggle?.(active);
  }, [active]);

  const handleToggleChange = (state: boolean) => {
    setActive(state);
  };

  return (
    <div className="flex items-center">
      <Switch checked={active} disabled={disabled} onCheckedChange={handleToggleChange} />
      <div
        className={cn('pl-3 text-sm', {
          'font-semibold text-fingoo-main': active,
        })}
      >
        {text}
      </div>
    </div>
  );
}
