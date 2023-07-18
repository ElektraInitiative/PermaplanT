import {calculateDistance, calculateScale} from "@/features/map_planning/layers/base/util";

describe('BaseLayerRightToolbar', () => {
    it('calculates correct distance given two points', () => {
        const point1 = { x: 0, y: 0 };
        const point2 = { x: 1, y: 0 };
        expect(calculateDistance(point1, point2)).toEqual(1);
    });

    it('calculates correct scale', () => {
        expect(calculateScale(50, 100, 100)).toEqual(50);
        expect(calculateScale(50, 100, 200)).toEqual(25);
        expect(calculateScale(50, 100, 25)).toEqual(200);
    });
});
