import { cn } from '@/app/utils/style';

type ToggleStateProps<L, R> = {
  state: [L, R];
  selectedState: L | R;
};

export default function ToggleState<L extends React.ReactNode, R extends React.ReactNode>({
  state,
  selectedState,
}: ToggleStateProps<L, R>) {
  const [leftState, rightState] = state;

  return (
    <div className="inline-flex overflow-hidden rounded-lg bg-gray-200">
      <State selected={leftState === selectedState}>{leftState}</State>
      <State selected={rightState === selectedState}>{rightState}</State>
    </div>
  );
}

function State({ selected, children }: React.PropsWithChildren<{ selected: boolean }>) {
  return (
    <div
      className={cn(' px-3 py-1 font-semibold', {
        'bg-slate-50 text-slate-400': !selected,
        'bg-gray-600 text-white': selected,
      })}
    >
      {children}
    </div>
  );
}
