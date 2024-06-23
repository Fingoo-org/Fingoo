'use client';
import ToggleGroup from '../../../components/view/molecule/toggle-group';
import { type SplitScreen, splitScreens } from '@/app/store/stores/numerical-guidance/indicator-board.store';
import { useLogger } from '@/app/logging/logging-context';
import { useSplitIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-split-indicator-board.hook';

function isSplitScreen(value: string): value is SplitScreen {
  return splitScreens.includes(value as SplitScreen);
}

export default function SplitScreenToggleGroup() {
  const logger = useLogger();
  const { splitScreen, transitionSplitScreen } = useSplitIndicatorBoard();

  const handleSplitScreenChange = (value: string) => {
    if (isSplitScreen(value)) {
      logger.track('click_screen_split_toggle', { toggle_type: value });
      transitionSplitScreen(value as SplitScreen);
    }
  };

  return (
    <ToggleGroup onValueChange={handleSplitScreenChange} value={splitScreen} type="single" variant={'default'}>
      <ToggleGroup.Item value="full">
        <MaximizeIcon className="h-4 w-4" />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="vertical">
        <SplitSquareVerticalIcon className="h-4 w-4 rotate-90 transform" />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="square">
        <LayoutGridIcon className="h-4 w-4" />
      </ToggleGroup.Item>
    </ToggleGroup>
  );
}

function LayoutGridIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function MaximizeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function SplitSquareVerticalIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 8V5c0-1 1-2 2-2h10c1 0 2 1 2 2v3" />
      <path d="M19 16v3c0 1-1 2-2 2H7c-1 0-2-1-2-2v-3" />
      <line x1="4" x2="20" y1="12" y2="12" />
    </svg>
  );
}
