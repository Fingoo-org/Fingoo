import '@testing-library/jest-dom';
import { server } from './app/mocks/server';

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
