import { act, renderHook } from '@testing-library/react';
import { resetAllSlice } from '@/app/store';
import { useStore } from '@/app/store';

describe('useStore', () => {
  beforeEach(() => {
    resetAllSlice();
  });

  it('init store', () => {
    const { result } = renderHook(() => useStore());

    expect(result.current.init).toEqual(true);
  });
});
