import { PlantingDto } from '@/bindings/definitions';
import { ExtendedPlantsSummary } from '@/features/map_planning/layers/plant/components/ExtendedPlantDisplay';
import { useFindPlantById } from '@/features/map_planning/layers/plant/hooks/useFindPlantById';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Label, Tag, Text } from 'react-konva';

export interface PlantLabelProps {
  /** Contains plant name that will be displayed on the label. */
  planting: PlantingDto;
}

export const PlantLabel = ({ planting }: PlantLabelProps) => {
  const labelRef = useRef<Konva.Label>(null);
  const [labelWidth, setLabelWidth] = useState<number>(0);

  useEffect(() => {
    if (labelRef.current === null) return;

    setLabelWidth(labelRef.current.width());
  }, [labelRef]);

  const { plant } = useFindPlantById(planting.plantId);
  if (plant === undefined) {
    return <Label></Label>;
  }

  const plantsSummary = new ExtendedPlantsSummary(plant);

  const labelOffsetX = labelWidth / 2;
  const labelOffsetY = (planting.height / 2) * planting.scaleY * 1.1;

  return (
    <Label
      listening={false}
      ref={labelRef}
      x={planting.x - labelOffsetX}
      y={planting.y + labelOffsetY}
    >
      {/* Colors are Gray 800 and Gray 50 from the DEFAULT tailwind theme.                             */}
      {/* Unfortunately we can not directly import colors from tailwind.                               */}
      {/* More details can be found in @/features/map_planning/layers/_frontend_only/util/Constants.ts */}
      <Tag fill={'#2d2d2d'} />
      <Text
        text={`${plantsSummary.displayName.common_name}`}
        fillEnabled={true}
        fill={'#fefefefe'}
      />
    </Label>
  );
};
