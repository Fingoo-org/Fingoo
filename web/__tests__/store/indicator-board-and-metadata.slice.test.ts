import { act, renderHook } from '@testing-library/react';
import { resetAllSlice } from '@/app/store';
import { useStore } from '@/app/store';

describe('indicatorBoardAndMetadataSlice', () => {
  beforeEach(() => {
    resetAllSlice();
  });

  it('메타데이터 추가 및 선택하기', () => {
    // given
    const { result } = renderHook(() => useStore());

    // when
    act(() => {
      result.current.createAndSelectMetadata({ id: '1', name: 'name', indicators: [] });
      result.current.createAndSelectMetadata({ id: '2', name: 'name', indicators: [] });
    });

    // then
    expect(result.current.metadataList[0]).toEqual({ id: '1', name: 'name', indicators: [] });
    expect(result.current.metadataList[1]).toEqual({ id: '2', name: 'name', indicators: [] });
    expect(result.current.selectedMetadataId).toEqual('2');
  });
});
