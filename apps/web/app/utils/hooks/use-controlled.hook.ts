import { SetStateAction, useCallback, useRef, useState } from 'react';

interface UseControlledArgs<T> {
  valueProps?: T;
  defaultValue: T;
}

type UseControlledReturn<T> = [T, React.Dispatch<SetStateAction<T>>];

export function useControlled<T>({ valueProps, defaultValue }: UseControlledArgs<T>): UseControlledReturn<T> {
  const [state, setState] = useState<T>(defaultValue);

  const { current: isControlled } = useRef(valueProps !== undefined);

  const value = (isControlled ? valueProps : state) as T;

  const setValue: React.Dispatch<SetStateAction<T>> = useCallback(
    (newValue) => {
      if (!isControlled) {
        setState(newValue);
      }
    },
    [isControlled],
  );

  return [value, setValue];
}
