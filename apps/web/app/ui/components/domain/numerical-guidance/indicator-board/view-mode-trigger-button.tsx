import React from 'react';
import { CornersIcon } from '@radix-ui/react-icons';
import IconButton from '../../../view/atom/icons/icon-button';
import { useViewMode } from '@/app/business/hooks/use-view-mode.hook';

export function ViewModeTriggerButton() {
  const { enableViewMode } = useViewMode();

  return <IconButton icon={CornersIcon} className="cursor-pointer" onClick={enableViewMode} color="gray" />;
}
