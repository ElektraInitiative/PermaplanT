import {Circle, Group, Line} from "react-konva";
import {EdgeRing, PolygonGeometry} from "@/features/map_planning/components/polygon/PolygonTypes";
import useMapStore from "@/features/map_planning/store/MapStore";
import {useState} from "react";

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
    const addShapeToTransformer = useMapStore((state) => state.addShapeToTransformer);

    const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

    const points = props.geometry.rings[0].map((point, index) =>
       <Group
           onClick={(e) => {
               addShapeToTransformer(e.currentTarget);
               setSelectedPoint(index);
           }}
           onDragEnd={(e) => {
               const modifiedPoints = props.geometry.rings[0];
               if (selectedPoint === null) return;

               modifiedPoints[selectedPoint] = {x: e.currentTarget.position.x, y: e.currentTarget.position.y};

               props.onGeometryModified({
                   srid: props.geometry.srid,
                   rings: [modifiedPoints],
               });

               setSelectedPoint(null);
           }}
       >
           <Circle
               x={point.x}
               y={point.y}
               fill="red"
               width={30}
               height={30}
           />
       </Group>
    );


    return (
        <Group
        >
            <Line
                listening={true}
                points={flattenRing(props.geometry.rings[0])}
                stroke="red"
                strokeWidth={10}
                lineCap="round"
                closed={true}
            />
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