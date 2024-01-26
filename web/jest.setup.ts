import '@testing-library/jest-dom';
import { server } from './app/mock/server';

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
