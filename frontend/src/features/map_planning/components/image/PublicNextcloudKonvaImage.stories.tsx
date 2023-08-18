import { PublicNextcloudKonvaImage } from './PublicNextcloudKonvaImage';
import { layerDecorator } from '@/utils/stories/layer-decorator';
import { QueryClientProviderDecorator } from '@/utils/stories/query-client-provider-decorator';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PublicNextcloudKonvaImage> = {
  component: PublicNextcloudKonvaImage,
  decorators: [layerDecorator, QueryClientProviderDecorator],
};

export default meta;

type Story = StoryObj<typeof PublicNextcloudKonvaImage>;

export const Default: Story = {
  args: {
    width: 400,
    height: 400,
  },
};
