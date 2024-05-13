import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { scenarios } from './scenarios.mock';

const scenarioName = new URLSearchParams(window.location.search).get('scenario');
const isMocking = new URLSearchParams(window.location.search).get('isMocking');

const runtimeScenarios = scenarios[scenarioName === 'error' ? scenarioName : 'success'];
const runtimeHandlers = isMocking !== 'false' ? [...runtimeScenarios, ...handlers] : [];

export const worker = setupWorker(...runtimeHandlers);
