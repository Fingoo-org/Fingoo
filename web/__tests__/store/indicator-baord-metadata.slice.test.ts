import { act, renderHook } from '@testing-library/react';
import { resetAllSlice } from '@/app/store';
import { useStore } from '@/app/store';

describe('indicatorBoardMetadataSlice', () => {
  beforeEach(() => {
    resetAllSlice();
  });

  it('초기 설정 확인', () => {
    // given
    const { result } = renderHook(() => useStore());

    // when
    // then
    expect(result.current.metadataList).toEqual([]);
  });

  it('메타데이터 추가하기', () => {
    // given
    const { result } = renderHook(() => useStore());

    // when
    act(() => {
      result.current.addMetadata({ id: '1', name: 'name', indicators: [] });
    });

    // then
    expect(result.current.metadataList[0]).toEqual({ id: '1', name: 'name', indicators: [] });
  });

  it('메타데이터 두번 연속 추가하기', () => {
    // given
    const { result } = renderHook(() => useStore());

    // when
    act(() => {
      result.current.addMetadata({ id: '1', name: 'name', indicators: [] });
      result.current.addMetadata({ id: '2', name: 'name', indicators: [] });
    });

    // then
    expect(result.current.metadataList[0]).toEqual({ id: '1', name: 'name', indicators: [] });
    expect(result.current.metadataList[1]).toEqual({ id: '2', name: 'name', indicators: [] });
  });
});
