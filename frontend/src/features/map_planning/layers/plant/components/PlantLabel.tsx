import { PlantingDto } from '@/api_types/definitions';
import { usePlant } from '@/features/map_planning/layers/plant/hooks/usePlant';
import { MapLabel } from '@/features/map_planning/utils/MapLabel';
import { commonName } from '@/utils/plant-naming';
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

  const { plant } = usePlant(planting.plantId);
  if (plant === undefined) {
    return <Label></Label>;
  }

  const labelOffsetX = labelWidth / 2;
  const labelOffsetY = (planting.height / 2) * planting.scaleY * 1.1;

  return (
    <MapLabel
      listening={false}
      ref={labelRef}
      x={planting.x - labelOffsetX}
      y={planting.y + labelOffsetY}
      content={commonName(plant)}
    />
  );
};
