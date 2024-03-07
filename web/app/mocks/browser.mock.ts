import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { scenarios } from './scenarios.mock';

const scenarioName = new URLSearchParams(window.location.search).get('scenario');

const runtimeScenarios = scenarios[scenarioName === 'error' ? scenarioName : 'success'];

export const worker = setupWorker(...runtimeScenarios, ...handlers);
