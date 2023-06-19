import { layerDecorator } from '@/utils/stories/layer-decorator';
import type { Meta, StoryObj } from '@storybook/react';
import { NextcloudKonvaImage } from './NextcloudKonvaImage';

const meta: Meta<typeof NextcloudKonvaImage> = {
  component: NextcloudKonvaImage,
  decorators: [layerDecorator]
};

export default meta;

type Story = StoryObj<typeof NextcloudKonvaImage>;

export const NextcloudKonvaImageStory: Story = {
  args: {
    width:400,
    height:400
  },
};
