'use client';

import { useEffect, useState } from 'react';
import Button from '../button/button';
import { ButtonVariant, Color, Size } from '@/app/utils/style';
import IconButton from '../icons/icon-button';

type ToggleButtonProps = {
  text: string;
  activeColor?: Color;
  variant?: ButtonVariant;
  size?: Size;
  icon?: React.ElementType;
  disabled?: boolean;
  onToggle?: (active: boolean) => void;
};

export default function ToggleButton({
  text,
  icon,
  activeColor = 'blue',
  size = 'md',
  variant = 'light',
  disabled = false,
  onToggle,
}: ToggleButtonProps): JSX.Element {
  const [active, setActive] = useState(false);

  useEffect(() => {
    onToggle?.(active);
  }, [active]);

  const handleToggle = () => {
    setActive(!active);
  };

  return (
    <Button
      disabled={disabled}
      size={size}
      variant={variant}
      onClick={handleToggle}
      color={active ? activeColor : 'gray'}
    >
      <div className="flex items-center">
        {icon ? <IconButton color={active ? activeColor : 'gray'} variant={'simple'} icon={icon} size={size} /> : null}
        {text}
      </div>
    </Button>
  );
}
