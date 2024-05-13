import type { Preview } from '@storybook/react';
import { handlers } from '../app/mocks/handlers';
import { initialize, mswDecorator } from 'msw-storybook-addon';

initialize({}, [...handlers]);

import '../app/globals.css';

const preview: Preview = {
  decorators: [mswDecorator],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
};

export default preview;
