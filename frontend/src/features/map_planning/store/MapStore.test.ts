import useMapStore from './MapStore';
import { ObjectState, TrackedLayers } from './MapStoreTypes';
import { TRACKED_DEFAULT_STATE } from './TrackedMapStore';
import { UNTRACKED_DEFAULT_STATE } from './UntrackedMapStore';

describe('MapHistoryStore', () => {
  it('creates empty layers for each LayerName', () => {
    initPlantLayerInStore();
    const { trackedState } = useMapStore.getState();

    expect(trackedState).toBeDefined();

    for (const layerName of Object.keys(trackedState.layers)) {
      expect(trackedState.layers[layerName as keyof TrackedLayers]).toEqual({
        index: layerName,
        objects: [],
        attributes: layerName === 'Base' ? { nextcloudImagePath: '', rotation: 0, scale: 0 } : undefined,
      });
    }
  });

  it('adds an object to the plants layer on ObjectAddAction', () => {
    const { dispatch } = useMapStore.getState();

    dispatch({
      type: 'OBJECT_ADD',
      payload: createPlantTestObject(1),
    });

    dispatch({
      type: 'OBJECT_ADD',
      payload: createPlantTestObject(2),
    });

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.Plant.objects).toHaveLength(2);
    expect(newState.layers.Plant.objects[0]).toMatchObject({
      id: '1',
    });
    expect(newState.layers.Plant.objects[1]).toMatchObject({
      id: '2',
      x: 2,
      y: 2,
    });
  });

  it("updates a single object's position on ObjectUpdatePositionAction", () => {
    const { dispatch } = useMapStore.getState();

    dispatch({
      type: 'OBJECT_ADD',
      payload: createPlantTestObject(1),
    });

    dispatch({
      type: 'OBJECT_UPDATE_POSITION',
      payload: [
        {
          id: '1',
          index: 'Plant',
          type: 'plant',
          x: 123,
          y: 123,
          height: 345,
          width: 345,
          rotation: 345,
          scaleX: 345,
          scaleY: 345,
        },
      ],
    });

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.Plant.objects).toHaveLength(1);
    expect(newState.layers.Plant.objects[0]).toMatchObject({
      id: '1',
      x: 123,
      y: 123,
    });
  });

  it("updates a single object's transform on ObjectUpdateTransformAction", () => {
    const { dispatch } = useMapStore.getState();

    dispatch({
      type: 'OBJECT_ADD',
      payload: createPlantTestObject(1),
    });

    dispatch({
      type: 'OBJECT_UPDATE_POSITION',
      payload: [
        {
          id: '1',
          index: 'Plant',
          type: 'plant',
          x: 100,
          y: 100,
          height: 200,
          width: 200,
          rotation: 300,
          scaleX: 1,
          scaleY: 1,
        },
      ],
    });

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.Plant.objects).toHaveLength(1);
    expect(newState.layers.Plant.objects[0]).toMatchObject({
      id: '1',
      x: 100,
      y: 100,
      height: 200,
      width: 200,
      rotation: 300,
      scaleX: 1,
      scaleY: 1,
    });
  });

  it('updates multiple objects on ObjectUpdatePositionAction', () => {
    const { dispatch } = useMapStore.getState();

    dispatch({
      type: 'OBJECT_ADD',
      payload: createPlantTestObject(1),
    });
    dispatch({
      type: 'OBJECT_ADD',
      payload: createPlantTestObject(2),
    });

    dispatch({
      type: 'OBJECT_UPDATE_POSITION',
      payload: [
        {
          id: '1',
          index: 'Plant',
          type: 'plant',
          x: 123,
          y: 123,
          height: 345,
          width: 345,
          rotation: 345,
          scaleX: 345,
          scaleY: 345,
        },
        {
          id: '2',
          index: 'Plant',
          type: 'plant',
          x: 123,
          y: 123,
          height: 345,
          width: 345,
          rotation: 345,
          scaleX: 345,
          scaleY: 345,
        },
      ],
    });

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.Plant.objects).toHaveLength(2);
    expect(newState.layers.Plant.objects[0]).toMatchObject({
      id: '1',
      x: 123,
      y: 123,
    });
    expect(newState.layers.Plant.objects[1]).toMatchObject({
      id: '2',
      x: 123,
      y: 123,
    });
  });

  it('updates multiple objects on ObjectUpdateTransformAction', () => {
    const { dispatch } = useMapStore.getState();

    dispatch({
      type: 'OBJECT_ADD',
      payload: createPlantTestObject(1),
    });
    dispatch({
      type: 'OBJECT_ADD',
      payload: createPlantTestObject(2),
    });

    dispatch({
      type: 'OBJECT_UPDATE_TRANSFORM',
      payload: [
        {
          id: '1',
          index: 'Plant',
          type: 'plant',
          x: 123,
          y: 123,
          height: 345,
          width: 345,
          rotation: 345,
          scaleX: 345,
          scaleY: 345,
        },
        {
          id: '2',
          index: 'Plant',
          type: 'plant',
          x: 123,
          y: 123,
          height: 345,
          width: 345,
          rotation: 345,
          scaleX: 345,
          scaleY: 345,
        },
      ],
    });

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.Plant.objects).toHaveLength(2);
    expect(newState.layers.Plant.objects[0]).toMatchObject({
      id: '1',
      x: 123,
      y: 123,
    });
    expect(newState.layers.Plant.objects[1]).toMatchObject({
      id: '2',
      x: 123,
      y: 123,
    });
  });

  it('reverts one action per ObjectUndoAction', () => {
    const { dispatch } = useMapStore.getState();

    dispatch({
      type: 'OBJECT_ADD',
      payload: createPlantTestObject(1),
    });

    dispatch({
      type: 'OBJECT_UPDATE_POSITION',
      payload: [
        {
          id: '1',
          index: 'Plant',
          type: 'plant',
          x: 123,
          y: 123,
          height: 345,
          width: 345,
          rotation: 345,
          scaleX: 345,
          scaleY: 345,
        },
      ],
    });

    dispatch({
      type: 'UNDO',
    });

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.Plant.objects).toHaveLength(1);
    expect(newState.layers.Plant.objects[0]).toEqual(createPlantTestObject(1));

    dispatch({
      type: 'UNDO',
    });

    const { trackedState: newState2 } = useMapStore.getState();
    expect(newState2.layers.Plant.objects).toHaveLength(0);
  });

  it('reverts multiple objects to their original state on ObjectUndoAction', () => {
    const { dispatch } = useMapStore.getState();

    dispatch({
      type: 'OBJECT_ADD',
      payload: createPlantTestObject(1),
    });
    dispatch({
      type: 'OBJECT_ADD',
      payload: createPlantTestObject(2),
    });

    dispatch({
      type: 'OBJECT_UPDATE_POSITION',
      payload: [
        {
          id: '1',
          index: 'Plant',
          type: 'plant',
          x: 123,
          y: 123,
          height: 345,
          width: 345,
          rotation: 345,
          scaleX: 345,
          scaleY: 345,
        },
        {
          id: '2',
          index: 'Plant',
          type: 'plant',
          x: 123,
          y: 123,
          height: 345,
          width: 345,
          rotation: 345,
          scaleX: 345,
          scaleY: 345,
        },
      ],
    });

    dispatch({
      type: 'UNDO',
    });

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.Plant.objects).toHaveLength(2);
    expect(newState.layers.Plant.objects[0]).toEqual(createPlantTestObject(1));
    expect(newState.layers.Plant.objects[1]).toEqual(createPlantTestObject(2));
  });

  it('repeats one action per ObjectRedoAction after ObjectUndoAction', () => {
    const { dispatch } = useMapStore.getState();

    dispatch({
      type: 'OBJECT_ADD',
      payload: createPlantTestObject(1),
    });

    dispatch({
      type: 'OBJECT_UPDATE_POSITION',
      payload: [
        {
          id: '1',
          index: 'Plant',
          type: 'plant',
          x: 123,
          y: 123,
          height: 345,
          width: 345,
          rotation: 345,
          scaleX: 345,
          scaleY: 345,
        },
      ],
    });

    dispatch({
      type: 'UNDO',
    });

    dispatch({
      type: 'REDO',
    });

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.Plant.objects).toHaveLength(1);
    expect(newState.layers.Plant.objects[0]).toMatchObject({
      id: '1',
      x: 123,
      y: 123,
    });
  });

  it('updates the selectedLayer on updateSelectedLayer', () => {
    useMapStore.setState({
      untrackedState: {
        ...UNTRACKED_DEFAULT_STATE,
      },
      trackedState: {
        ...TRACKED_DEFAULT_STATE,
      },
    });

    useMapStore.getState().updateSelectedLayer('Soil');

    const { untrackedState: newState } = useMapStore.getState();
    expect(newState.selectedLayer).toEqual('Soil');
  });

  // regression
  it('does not change the selectedLayer after an ObjectUndoAction', () => {
    useMapStore.setState({
      untrackedState: {
        ...UNTRACKED_DEFAULT_STATE,
      },
      trackedState: {
        ...TRACKED_DEFAULT_STATE,
      },
    });

    useMapStore.getState().updateSelectedLayer('Soil');

    const { dispatch } = useMapStore.getState();

    dispatch({
      type: 'OBJECT_ADD',
      payload: createPlantTestObject(1),
    });

    dispatch({
      type: 'UNDO',
    });

    const { untrackedState: newState } = useMapStore.getState();
    expect(newState.selectedLayer).toEqual('Soil');
  });
});

function initPlantLayerInStore(objects: ObjectState[] = []) {
  useMapStore.setState({
    untrackedState: {
      ...UNTRACKED_DEFAULT_STATE,
    },
    trackedState: {
      ...TRACKED_DEFAULT_STATE,
      layers: {
        ...TRACKED_DEFAULT_STATE.layers,
        Plant: {
          ...TRACKED_DEFAULT_STATE.layers.Plant,
          objects,
        },
      },
    },
  });
}

function createPlantTestObject(testValue: number): ObjectState {
  return {
    id: testValue.toString(),
    type: 'plant',
    index: 'Plant',
    height: testValue,
    width: testValue,
    x: testValue,
    y: testValue,
    rotation: testValue,
    scaleX: testValue,
    scaleY: testValue,
  };
}
