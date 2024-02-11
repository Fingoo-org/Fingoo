import { render } from '@testing-library/react';
import Button from '@/app/ui/components/view/atom/button/button';

describe('Button', () => {
  it('default 스타일의 버튼을 렌더링한다..', () => {
    const { container } = render(<Button color={'blue'}>버튼</Button>);

    expect(container).toMatchSnapshot();
  });

  it('primary 스타일의 버튼을 렌더링한다.', () => {
    const { container } = render(
      <Button color={'blue'} variant={'primary'}>
        버튼
      </Button>,
    );

    expect(container).toMatchSnapshot();
  });
  it('secondary 스타일의 버튼을 렌더링한다.', () => {
    const { container } = render(
      <Button color={'blue'} variant={'secondary'}>
        버튼
      </Button>,
    );

    expect(container).toMatchSnapshot();
  });
  it('light 스타일의 버튼을 렌더링한다.', () => {
    const { container } = render(
      <Button color={'blue'} variant={'light'}>
        버튼
      </Button>,
    );

    expect(container).toMatchSnapshot();
  });
});
