import { useFindPlantById } from '../hooks/useFindPlantById';
import { ExtendedPlantsSummary } from './ExtendedPlantDisplay';
import { PlantingDto, PlantsSummaryDto } from '@/bindings/definitions';
import { PublicNextcloudKonvaImage } from '@/features/map_planning/components/image/PublicNextcloudKonvaImage';
import useMapStore from '@/features/map_planning/store/MapStore';
import { setTooltipPosition } from '@/features/map_planning/utils/Tooltip';
import Konva from 'konva';
import { Group, Circle, Rect } from 'react-konva';

export type PlantingElementProps = {
  planting: PlantingDto;
};

const placeTooltip = (plant: PlantsSummaryDto | undefined) => {
  const stage = useMapStore.getState().stageRef.current;
  const tooltip = useMapStore.getState().tooltipRef.current;

  if (!stage || !tooltip || !plant) return;

  setTooltipPosition(tooltip, stage);

  const extendedPlant = new ExtendedPlantsSummary(plant);
  const displayValues = extendedPlant.displayName;

  tooltip.destroyChildren();

  let sumWidth = 0;
  const PADDING = 6;
  const FONTSIZE = 24;

  const group = new Konva.Group();

  if (displayValues.common_name) {
    const common_name_text = new Konva.Text({
      text: displayValues.common_name + ' ',
      fontSize: FONTSIZE,
      padding: PADDING,
      fill: 'white',
    });

    sumWidth += common_name_text.width();
    group.add(common_name_text);
  }

  const unique_name_text_prefix = displayValues.common_name ? '(' : '';
  const unique_name_text_postfix = displayValues.cultivar ? '' : ')';
  const unique_name_text = new Konva.Text({
    text: unique_name_text_prefix + displayValues.unique_name + unique_name_text_postfix,
    fontStyle: 'italic',
    fontSize: FONTSIZE,
    padding: PADDING,
    fill: 'white',
    x: sumWidth - PADDING,
  });

  sumWidth += unique_name_text.width();
  group.add(unique_name_text);

  if (displayValues.cultivar) {
    const cultivar_text_postfix = displayValues.common_name ? ')' : '';
    const cultivar_text = new Konva.Text({
      text: "'" + displayValues.cultivar + "'" + cultivar_text_postfix,
      fontSize: FONTSIZE,
      padding: PADDING,
      fill: 'white',
      x: sumWidth - PADDING,
    });

    sumWidth += cultivar_text.width();
    group.add(cultivar_text);
  }

  const rect = new Konva.Rect({
    x: -PADDING,
    width: sumWidth,
    height: FONTSIZE + 2 * PADDING,
    fill: 'black',
  });

  tooltip.add(rect);
  tooltip.add(group);
  tooltip.show();
};

const hideTooltip = () => {
  const tooltip = useMapStore.getState().tooltipRef.current;
  tooltip?.hide();
};

export function PlantingElement({ planting }: PlantingElementProps) {
  const { plant } = useFindPlantById(planting.plantId);

  const addShapeToTransformer = useMapStore((state) => state.addShapeToTransformer);
  const selectPlanting = useMapStore((state) => state.selectPlanting);

  const selectedPlanting = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlanting,
  );

  return (
    <Group
      {...planting}
      planting={planting}
      onClick={(e) => {
        const placeEvent = new Event('selectPlant');
        document.getElementById('canvas')?.dispatchEvent(placeEvent);
        addShapeToTransformer(e.currentTarget);
        selectPlanting(planting);
      }}
      onMouseOut={hideTooltip}
      onMouseMove={() => placeTooltip(plant)}
    >
      <Circle
        width={planting.width}
        height={planting.height}
        x={0}
        y={0}
        fill={selectedPlanting?.id === planting.id ? '#0084ad' : '#6f9e48'}
      />
      {plant ? (
        <PublicNextcloudKonvaImage
          shareToken="2arzyJZYj2oNnHX"
          path={`Icons/${plant?.unique_name}.png`}
          width={planting.width * 0.9}
          height={planting.height * 0.9}
          offset={{ x: (planting.width * 0.9) / 2, y: (planting.height * 0.9) / 2 }}
          showErrorMessage={false}
        />
      ) : (
        <Rect width={0} height={0} />
      )}
    </Group>
  );
}
