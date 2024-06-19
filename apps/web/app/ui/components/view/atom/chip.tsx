type ChipProps = {
  text: string;
  value?: string;
  onClick?: (text: string) => void;
};
export function Chip({ text, value, onClick }: ChipProps) {
  const handleClick = () => {
    onClick?.(value ?? text);
  };

  return (
    <button
      onClick={handleClick}
      className="flex animate-pulse  items-center rounded-md bg-fingoo-gray-1.5 px-4 py-2 text-xs font-bold"
    >
      <p>{text}</p>
    </button>
  );
}
