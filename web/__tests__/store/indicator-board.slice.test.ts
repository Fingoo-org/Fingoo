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
    expect(result.current.selectedMetaDataID).toBe(null);
    expect(result.current.interval).toBe('day');
  });

  it('메타데이터 선택하기', () => {
    // given
    const { result } = renderHook(() => useStore());
    act(() => result.current.addMetadata({ id: '1', name: 'name', indicators: [] }));

    // when
    act(() => result.current.selectMetaData('1'));

    // then
    expect(result.current.selectedMetaDataID).toBe('1');
  });
});
