import Konva from 'konva';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { Label } from 'react-konva';
import { PlantingDto } from '@/api_types/definitions';
import { useFindPlantById } from '@/features/map_planning/layers/plant/hooks/plantHookApi';
import { MapLabel } from '@/features/map_planning/utils/MapLabel';
import { commonName } from '@/utils/plant-naming';

export interface PlantLabelProps {
  /** Contains plant name that will be displayed on the label. */
  planting: PlantingDto;
}

export const PlantLabel = React.memo(function PlantLabel({ planting }: PlantLabelProps) {
  const labelRef = useRef<Konva.Label>(null);
  const [labelWidth, setLabelWidth] = useState(0);
  const { data: plant } = useFindPlantById({ plantId: planting.plantId });

  useLayoutEffect(() => {
    if (labelRef.current !== null) {
      setLabelWidth(labelRef.current.width());
    }
  }, [plant]);

  if (plant === undefined) {
    return <Label></Label>;
  }

  const labelOffsetXArea = planting.sizeX / 2 - labelWidth / 2;
  const labelOffsetYArea = planting.sizeY + 10;

  const labelOffsetX = -labelWidth / 2;
  const labelOffsetY = planting.sizeY / 2 + 10;

  return (
    <MapLabel
      listening={false}
      ref={labelRef}
      x={planting.x + (planting.isArea ? labelOffsetXArea : labelOffsetX)}
      y={planting.y + (planting.isArea ? labelOffsetYArea : labelOffsetY)}
      content={commonName(plant)}
    />
  );
});
