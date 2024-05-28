import type { Meta, StoryObj } from '@storybook/react';

import MetadataList from './metadata-list';

const meta = {
  title: 'numerical-guidance/molecule/MetadataList',
  component: MetadataList,
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MetadataList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
