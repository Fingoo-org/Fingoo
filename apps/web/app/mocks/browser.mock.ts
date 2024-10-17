import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { scenarios } from './scenarios.mock';

// 런타임에 모의 시나리오를 전환하기 위한 코드
const scenarioName = new URLSearchParams(window.location.search).get('scenario');
// 런타임에 모킹 여부를 결정하기 위한 코드
const isMocking = new URLSearchParams(window.location.search).get('isMocking');

const runtimeScenarios = scenarios[scenarioName === 'error' ? scenarioName : 'success'];
const runtimeHandlers = isMocking !== 'false' ? [...runtimeScenarios, ...handlers] : [];

export const worker = setupWorker(...runtimeHandlers);
