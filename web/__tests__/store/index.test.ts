import { act, renderHook } from '@testing-library/react';
import { resetAllSlice } from '@/app/store';
import { useStore } from '@/app/store';

describe('useStore', () => {
  beforeEach(() => {
    resetAllSlice();
  });

  it('초기 설정 확인', () => {
    const { result } = renderHook(() => useStore());

    expect(result.current.init).toBe(true);
  });
});
