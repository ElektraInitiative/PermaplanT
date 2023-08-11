import {Circle, Group, Line} from "react-konva";
import {EdgeRing, PolygonGeometry} from "@/features/map_planning/components/polygon/PolygonTypes";

export interface PolygonProps {
    /** Geometry data that should be displayed by this component. */
    geometry: PolygonGeometry,
    /**
     * Callback that fires each time the user tries to modify the geometry given in in the props.
     *
     * @param PolygonGeometry The modified geometry.
     */
    onGeometryModified: (geometry: PolygonGeometry) => void;
}

export const Polygon = (props: PolygonProps) => {
    const points = props.geometry.rings.map(
        (ring) => ring.map((point) =>
            <Circle
                x={point.x}
                y={point.y}
                fill="red"
                width={30}
                height={30}
            />
        )
    );

    const connectionLines = props.geometry.rings.map(
        (ring) => <Line
          points={flattenRing(ring)}
          stroke="red"
          strokeWidth={10}
          lineCap="round"
          closed={true}
        />
    );

    return (
        <Group listening={true}>
            {connectionLines}
            {points}
        </Group>
    );
};

/**
 * Extract the coordinates from an edge ring and put them in a flattened array.
 *
 * @param ring The ring to flatten.
 */
function flattenRing(ring: EdgeRing): number[] {
    return ring
        .map((point) => [point.x, point.y])
        .reduce((accumulator, next) => accumulator.concat(next));
}