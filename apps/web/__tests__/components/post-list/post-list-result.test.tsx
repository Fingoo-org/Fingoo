import { resetMockDB } from '@/app/mocks/db';
import { act, render, screen, waitFor } from '@testing-library/react';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';
import { resetAllStore } from '@/app/store/stores/reset-store';
import PostListResult from '@/app/ui/components/domain/post/post-list/post-list-result';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import userEvent from '@testing-library/user-event';

describe('postListResult', () => {
  beforeEach(() => {
    resetMockDB();
    resetAllStore();
  });

  it('포스트 리스트를 보여준다.', async () => {
    // given
    render(
      <SWRProviderWithoutCache>
        <PostListResult />
      </SWRProviderWithoutCache>,
    );
    await waitFor(() => expect(screen.getByRole('tablist')).toBeVisible());

    // then
    expect(await screen.findByText(/John Doe/i)).toBeVisible();
    expect(await screen.findByText(/This is the first post/i)).toBeVisible();
  });

  // it('사용자가 하트를 클릭하여 포스트에 좋아요를 선택/해제할 수 있다.', async () => {
  //   // given
  //   const user = userEvent.setup();
  //   render(
  //     <SWRProviderWithoutCache>
  //       <PostListResult />
  //     </SWRProviderWithoutCache>,
  //   );
  //   await waitFor(() => expect(screen.getByRole('tablist')).toBeVisible());

  //   // when: 사용자가 하트를 클릭
  //   const heartButton = await (await screen.findByText(/This is the first post/i)).parentElement?.querySelector('svg');
  //   expect(heartButton).not.toBeNull();

  //   // 첫 클릭: 좋아요 선택
  //   await user.click(heartButton!);

  //   // then: 하트가 빨간색으로 변환 (선택됨) - 스타일을 확인
  //   expect(heartButton).toHaveStyle('stroke: red');

  //   // 다시 클릭: 좋아요 해제
  //   await user.click(heartButton!);

  //   // then: 하트가 회색으로 변환 (선택 해제됨) - 스타일을 확인
  //   expect(heartButton).toHaveStyle('stroke: gray');
  // });
});
