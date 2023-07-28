import { PlantsSummaryDto } from '@/bindings/definitions';
import { capitalize } from '@/features/map_planning/utils/string-utils';
import { Group, Text } from 'react-konva';

export interface PlantLabelProps {
  /** Contains plant name that will be displayed on the label. */
  plant: PlantsSummaryDto;
  /** Where the label will be placed on the Konva layer (horizontal component). */
  offset: { x: number; y: number };
}

export const PlantLabel = ({ plant }: PlantLabelProps) => {
  const commonName = plant.common_name_en === undefined ? '' : plant.common_name_en[0];

  return (
    <Group listening={false}>
      <Text
        text={`${capitalize(commonName)} (${capitalize(plant.unique_name)})`}
        x={30}
        y={-5}
        fillEnabled={true}
        fill={'#ffffff'}
      />
    </Group>
  );
};
