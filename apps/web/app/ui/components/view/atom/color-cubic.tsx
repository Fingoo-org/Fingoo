import { cn } from '@/app/utils/style';

type ColorCubicProps = {
  color: string;
};

export default function ColorCubic({ color }: ColorCubicProps) {
  return <div className={cn(`mr-2 h-4 w-4  rounded-sm`, `bg-${color}`)} />;
}
