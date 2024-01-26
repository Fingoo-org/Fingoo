import { act, renderHook } from '@testing-library/react';
import { resetAllStore } from '@/app/stores/numerical-guidance.store';
import { useNumericalGuidanceStore } from '@/app/stores/numerical-guidance.store';

describe('useNumericalGuidanceStore', () => {
  beforeEach(() => {
    resetAllStore();
  });

  it('초기 설정 확인', () => {
    // given
    const { result } = renderHook(() => useNumericalGuidanceStore());

    // when
    // then
    expect(result.current.selectedMetadataId).toBe(null);
    expect(result.current.interval).toBe('day');
  });

  it('메타데이터 선택하기', () => {
    // given
    const { result } = renderHook(() => useNumericalGuidanceStore());

    // when
    act(() => result.current.actions.selectMetadata('1'));

    // then
    expect(result.current.selectedMetadataId).toBe('1');
  });
});
