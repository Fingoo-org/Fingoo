import React from 'react';
import { cn } from '@/app/utils/style';

type IndicatorSelectItemProps = {
  name: string;
  symbol: string;
  type: string;
  isSelected: boolean;
  onSelect: () => void;
};

export default function IndicatorSelectItem({ name, symbol, type, isSelected, onSelect }: IndicatorSelectItemProps) {
  return (
    <div
      className={cn(
        'flex cursor-pointer items-center justify-between rounded-lg p-3',
        isSelected ? 'border border-fingoo-main bg-white' : 'border border-gray-200 bg-white',
      )}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
          <img src="/path-to-us-flag.png" alt="US Flag" className="h-6 w-6" />
        </div>
        <div>
          <div className="font-bold">{name}</div>
          <div className="text-sm text-gray-500">
            {symbol} | {type}
          </div>
        </div>
      </div>
      <div
        className={cn(
          'ml-8 flex h-6 w-6 items-center justify-center rounded-full',
          isSelected ? 'bg-fingoo-main' : 'bg-gray-200',
        )}
      >
        {isSelected && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
