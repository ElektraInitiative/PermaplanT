import type { Meta, StoryObj } from '@storybook/react';
import { layerDecorator } from '@/utils/stories/layer-decorator';
import { QueryClientProviderDecorator } from '@/utils/stories/query-client-provider-decorator';
import { NextcloudKonvaImage } from './NextcloudKonvaImage';

const meta: Meta<typeof NextcloudKonvaImage> = {
  component: NextcloudKonvaImage,
  decorators: [layerDecorator, QueryClientProviderDecorator],
};

export default meta;

type Story = StoryObj<typeof NextcloudKonvaImage>;

export const NextcloudKonvaImageStory: Story = {
  args: {
    width: 400,
    height: 400,
  },
};
