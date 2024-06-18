import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import { server } from './app/mocks/server.mock';
import { createElement } from 'react';

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

// recharts에서 ResponsiveContainer를 사용하는 컴포넌트를 테스트할 때, 에러가 발생하는 것을 방지하기 위한 설정
// https://github.com/recharts/recharts/issues/2268
jest.mock('recharts', () => {
  const OriginModule = jest.requireActual('recharts');

  return {
    ...OriginModule,
    ResponsiveContainer: ({ height, children }: any) => (
      <div className="recharts-responsive-container" style={{ width: 300, height: 300 }}>
        {children}
      </div>
    ),
  };
});

const observeSpy = jest.fn();
const height = 200;
const width = 200;
global.ResizeObserver = class MockedResizeObserver {
  constructor(cb: ResizeObserverCallback) {
    setTimeout(() => {
      cb(
        [
          {
            contentRect: {
              height,
              width,
            },
          },
        ] as ResizeObserverEntry[],
        this,
      );
    }, 150);
  }

  observe = observeSpy;
  unobserve = jest.fn();
  disconnect = jest.fn();
};

global.structuredClone = jest.fn((x) => JSON.parse(JSON.stringify(x)));
