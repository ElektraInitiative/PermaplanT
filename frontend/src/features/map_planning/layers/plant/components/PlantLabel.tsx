import { PlantingDto } from '@/bindings/definitions';
import { ExtendedPlantsSummary } from '@/features/map_planning/layers/plant/components/ExtendedPlantDisplay';
import { useFindPlantById } from '@/features/map_planning/layers/plant/hooks/useFindPlantById';
import { MapLabel } from '@/features/map_planning/utils/MapLabel';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Label } from 'react-konva';

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
    <MapLabel
      listening={false}
      ref={labelRef}
      x={planting.x - labelOffsetX}
      y={planting.y + labelOffsetY}
      content={`${plantsSummary.displayName.common_name}`}
    />
  );
};
