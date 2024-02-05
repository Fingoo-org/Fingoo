import '@testing-library/jest-dom';
import { server } from './app/mocks/server.mock';
import { createElement } from 'react';

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

// recharts에서 ResponsiveContainer를 사용하는 컴포넌트를 테스트할 때, 에러가 발생하는 것을 방지하기 위한 설정
jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: (props: never) => createElement('div', props),
}));
