import {Layer, Group, Line, Circle} from "react-konva";
import Konva from "konva/cmj";
import useMapStore from "@/features/map_planning/store/MapStore";

export const GridLayer = (props: Konva.LayerConfig) => {
    const mapBounds = useMapStore(state => state.untrackedState.editorBounds);

    return (
        <Layer listening={false} visible={props.visible} opacity={props.opacity}>
          <Grid
              x={mapBounds.x}
              y={mapBounds.y}
              width={mapBounds.width}
              height={mapBounds.height}
          />
        </Layer>
    )
};

interface GridProps {
    x: number,
    y: number,
    width: number,
    height: number,
};

const Grid = (rect: GridProps) => {
    let step = 10;
    if (rect.width > 5000) {
        step = 1000;
    } else if (rect.width > 2000) {
        step = 100;
    }

    const dynamicStrokeWidth = rect.width / 3000;

    const startX = -rect.x - rect.width  - ((-rect.x - rect.width) % step);
    const startY = -rect.y - rect.height - ((-rect.y - rect.height) % step);

    const endX = -rect.x + rect.width;
    const endY = -rect.y + rect.height;

    const horizontalLines = [];
    for(let x = startX; x < endX; x += step) {
        const width = x % 100 === 0 ? dynamicStrokeWidth * 2 : dynamicStrokeWidth;
        horizontalLines.push(<Line strokeWidth={width} stroke={"red"} points={[x, startY, x, endY]}></Line>);
    }

    const verticalLines = [];
    for(let y = startY; y < endY; y += step) {
        const width = y % 100 === 0 ? dynamicStrokeWidth * 2 : dynamicStrokeWidth;
        verticalLines.push(<Line strokeWidth={width} stroke={"red"} points={[startX, y, endX, y]}></Line>);
    }

    return (
        <Group>
            {horizontalLines}
            {verticalLines}
        </Group>
    )
}