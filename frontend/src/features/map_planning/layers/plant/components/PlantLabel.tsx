import { PlantsSummaryDto } from '@/bindings/definitions';
import { capitalize } from '@/features/map_planning/utils/string-utils';
import { Label, Tag, Text } from 'react-konva';

export interface PlantLabelProps {
  /** Contains plant name that will be displayed on the label. */
  plant: PlantsSummaryDto;
  /** Where the label will be placed on the Konva layer (horizontal component). */
  offset: { x: number; y: number };
}

export const PlantLabel = ({ plant }: PlantLabelProps) => {
  const commonName = plant.common_name_en === undefined ? '' : plant.common_name_en[0];

  return (
    <Label listening={false} x={35} y={-5}>
      {/* Colors are Gray 800 and Gray 50 from the DEFAULT tailwind theme.                             */}
      {/* Unfortunately we can not directly import colors from tailwind.                               */}
      {/* More details can be found in @/features/map_planning/layers/_frontend_only/util/Constants.ts */}
      <Tag fill={'#2d2d2d'} />
      <Text
        text={`${capitalize(commonName)} (${capitalize(plant.unique_name)})`}
        fillEnabled={true}
        fill={'#fefefefe'}
      />
    </Label>
  );
};
