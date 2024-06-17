type BlankProps = {
  isBlank: boolean;
  blankFallback: React.ReactNode;
};

export default function Blank({ isBlank, blankFallback, children }: React.PropsWithChildren<BlankProps>) {
  if (isBlank) {
    return <div className="flex h-full w-full items-center justify-center">{blankFallback}</div>;
  }

  return <>{children}</>;
}
