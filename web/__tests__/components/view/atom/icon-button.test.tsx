import { render } from '@testing-library/react';
import IconButton from '@/app/ui/components/view/atom/icon-button/icon-button';
import { DotsHorizontalIcon } from '@heroicons/react/solid';

describe('IconButton', () => {
  it('default 스타일의 아이콘 버튼을 렌더링한다.', () => {
    const { container } = render(<IconButton icon={DotsHorizontalIcon} color={'blue'} />);

    expect(container).toMatchSnapshot();
  });

  it('simple 스타일의 아이콘 버튼을 렌더링한다.', () => {
    const { container } = render(<IconButton icon={DotsHorizontalIcon} color={'blue'} variant={'simple'} />);

    expect(container).toMatchSnapshot();
  });

  it('outlined 스타일의 아이콘 버튼을 렌더링한다.', () => {
    const { container } = render(<IconButton icon={DotsHorizontalIcon} color={'blue'} variant={'outlined'} />);

    expect(container).toMatchSnapshot();
  });
});
