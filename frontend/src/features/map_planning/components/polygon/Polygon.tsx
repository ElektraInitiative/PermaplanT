import {Circle, Group} from "react-konva";
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
                width={10}
                height={10}
            />
        )
    );

    return (
        <Group>
            {points}
        </Group>
    );
};
