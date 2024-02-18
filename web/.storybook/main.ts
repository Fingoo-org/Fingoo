// optimization: https://storybook.js.org/blog/optimize-storybook-7-6/
// path alias: https://storybook.js.org/docs/builders/webpack#typescript-modules-are-not-resolved-within-storybook
import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

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
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../'),
      };
    }
    return config;
  },
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
