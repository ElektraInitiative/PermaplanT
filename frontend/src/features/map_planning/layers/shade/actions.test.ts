import { describe, expect } from 'vitest';
import { Shade, ShadingDto } from '@/api_types/definitions';
import {
  CreateShadingAction,
  DeleteShadingAction,
  UpdateShadingAction,
  UpdateShadingAddDateAction,
  UpdateShadingRemoveDateAction,
} from '@/features/map_planning/layers/shade/actions';
import useMapStore from '@/features/map_planning/store/MapStore';

describe('Shade layer actions', () => {
  it('adds shading objects to the shade layer on CreateShadingAction', () => {
    const { executeAction } = useMapStore.getState();
    const createAction1 = new CreateShadingAction(createShadingTestObject(1));
    const createAction2 = new CreateShadingAction(createShadingTestObject(2));

    executeAction(createAction1);
    executeAction(createAction2);

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.shade.objects).toHaveLength(2);
    expect(newState.layers.shade.loadedObjects).toHaveLength(2);
    expect(newState.layers.shade.objects[0]).toMatchObject({
      id: '1',
      geometry: {
        srid: '',
        rings: [],
      },
      shade: Shade.LightShade,
      removeDate: undefined,
      addDate: '1970-01-01',
      layerId: 1,
    });
    expect(newState.layers.shade.objects[1]).toMatchObject({
      id: '2',
      geometry: {
        srid: '',
        rings: [],
      },
      shade: Shade.LightShade,
      removeDate: undefined,
      addDate: '1970-01-01',
      layerId: 1,
    });
  });

  it('removes shading objects from the shade layer on DeleteShadingAction', () => {
    const { executeAction } = useMapStore.getState();
    const createAction = new CreateShadingAction(createShadingTestObject(1));
    const deleteAction = new DeleteShadingAction(createShadingTestObject(1));

    executeAction(createAction);
    executeAction(deleteAction);

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.shade.objects).toHaveLength(0);
    expect(newState.layers.shade.loadedObjects).toHaveLength(0);
  });

  it('changes shading objects on the shade layer on UpdateShadingAction', () => {
    const { executeAction } = useMapStore.getState();
    const createAction = new CreateShadingAction(createShadingTestObject(1));
    executeAction(createAction);

    const testObj = createShadingTestObject(1);
    testObj.shade = Shade.PermanentDeepShade;
    const updateAction = new UpdateShadingAction(testObj);
    executeAction(updateAction);

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.shade.objects.length).toBe(1);
    expect(newState.layers.shade.loadedObjects.length).toBe(1);
    expect(newState.layers.shade.objects[0]).toMatchObject({
      id: '1',
      geometry: {
        srid: '',
        rings: [],
      },
      shade: Shade.PermanentDeepShade,
      removeDate: undefined,
      addDate: '1970-01-01',
      layerId: 1,
    });
  });

  it('changes shading objects on the shade layer on UpdateShadingAddDateAction', () => {
    const { executeAction } = useMapStore.getState();
    const createAction = new CreateShadingAction(createShadingTestObject(1));
    executeAction(createAction);

    const testObj = createShadingTestObject(1);
    testObj.addDate = '2020-01-01';
    const updateAction = new UpdateShadingAddDateAction(testObj);
    executeAction(updateAction);

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.shade.objects.length).toBe(1);
    expect(newState.layers.shade.loadedObjects.length).toBe(1);
    expect(newState.layers.shade.objects[0]).toMatchObject({
      id: '1',
      geometry: {
        srid: '',
        rings: [],
      },
      shade: Shade.LightShade,
      removeDate: undefined,
      addDate: '2020-01-01',
      layerId: 1,
    });
  });

  it('changes shading objects on the shade layer on UpdateShadingRemoveDateAction', () => {
    const { executeAction } = useMapStore.getState();
    const createAction = new CreateShadingAction(createShadingTestObject(1));
    executeAction(createAction);

    const testObj = createShadingTestObject(1);
    testObj.removeDate = '9999-01-01';
    const updateAction = new UpdateShadingRemoveDateAction(testObj);
    executeAction(updateAction);

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.shade.objects.length).toBe(1);
    expect(newState.layers.shade.loadedObjects.length).toBe(1);
    expect(newState.layers.shade.objects[0]).toMatchObject({
      id: '1',
      geometry: {
        srid: '',
        rings: [],
      },
      shade: Shade.LightShade,
      removeDate: '9999-01-01',
      addDate: '1970-01-01',
      layerId: 1,
    });
  });

  it('removes objects from the shade layer if the remove date is in the past', () => {
    const { executeAction } = useMapStore.getState();
    const testObj = createShadingTestObject(1);
    testObj.removeDate = '1970-01-02';
    const createAction = new CreateShadingAction(testObj);
    executeAction(createAction);

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.shade.objects.length).toBe(0);
    expect(newState.layers.shade.loadedObjects.length).toBe(1);
    expect(newState.layers.shade.loadedObjects[0]).toMatchObject({
      id: '1',
      geometry: {
        srid: '',
        rings: [],
      },
      shade: Shade.LightShade,
      removeDate: '1970-01-02',
      addDate: '1970-01-01',
      layerId: 1,
    });
  });

  it('removes objects from the shade layer if the add date is in the future', () => {
    const { executeAction } = useMapStore.getState();
    const testObj = createShadingTestObject(1);
    testObj.addDate = '9999-01-01';
    const createAction = new CreateShadingAction(testObj);
    executeAction(createAction);

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.shade.objects.length).toBe(0);
    expect(newState.layers.shade.loadedObjects.length).toBe(1);
    expect(newState.layers.shade.loadedObjects[0]).toMatchObject({
      id: '1',
      geometry: {
        srid: '',
        rings: [],
      },
      shade: Shade.LightShade,
      removeDate: undefined,
      addDate: '9999-01-01',
      layerId: 1,
    });
  });
});

function createShadingTestObject(number: number): ShadingDto {
  return {
    id: number.toString(),
    geometry: {
      srid: '',
      rings: [],
    },
    shade: Shade.LightShade,
    removeDate: undefined,
    addDate: '1970-01-01',
    layerId: 1,
  };
}
