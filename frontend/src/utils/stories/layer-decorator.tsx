import { ComponentType } from 'react';
import { Layer } from 'react-konva';
import { BaseStage } from '@/features/map_planning/components/BaseStage';

/**
 * A decorator to wrap stories in our base stage.
 * Use this decorator for components that need to be placed on a layer.
 *
 * @param Story The story to wrap in a Layer
 * @returns The story wrapped in a Layer
 */
export const layerDecorator = (Story: ComponentType) => {
  return (
    <BaseStage>
      <Layer listening={true}>
        <Story />
      </Layer>
    </BaseStage>
  );
};
