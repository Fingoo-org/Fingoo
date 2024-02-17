// optimization: https://storybook.js.org/blog/optimize-storybook-7-6/
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: { docs: false },
    },
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
  ],
  typescript: {
    reactDocgen: 'react-docgen', // or false if you don't need docgen at all
  },
  framework: {
    name: '@storybook/nextjs',
    options: { builder: { useSWC: true } },
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
