import { act, renderHook } from '@testing-library/react';
import { resetAllSlice } from '@/app/store';
import { useStore } from '@/app/store';

describe('indicatorBoardSlice', () => {
  beforeEach(() => {
    resetAllSlice();
  });

  it('초기 설정 확인', () => {
    // given
    const { result } = renderHook(() => useStore());

    // when
    // then
    expect(result.current.selectedMetadataId).toBe(null);
    expect(result.current.interval).toBe('day');
  });

  it('메타데이터 선택하기', () => {
    // given
    const { result } = renderHook(() => useStore());

    // when
    act(() => result.current.selectMetaData('1'));

    // then
    expect(result.current.selectedMetadataId).toBe('1');
  });
});
