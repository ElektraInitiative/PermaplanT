import { LayerDto, LayerType, PlantingDto } from '@/api_types/definitions';
import { CreatePlantAction, MovePlantAction, TransformPlantAction } from '../layers/plant/actions';
import useMapStore from './MapStore';
import { TrackedLayers } from './MapStoreTypes';
import { TRACKED_DEFAULT_STATE, UNTRACKED_DEFAULT_STATE } from './MapStoreTypes';

// mock the axios api configuration, so that we don't actually send requests to the backend
vi.mock('@/config/axios');

describe('MapHistoryStore', () => {
  it('creates empty layers for each LayerName', () => {
    initPlantLayerInStore();
    const { trackedState } = useMapStore.getState();

    expect(trackedState).toBeDefined();

    for (const layerName of Object.keys(trackedState.layers)) {
      if (layerName === LayerType.Base) continue;
      if (layerName === LayerType.Plants) continue;

      expect(trackedState.layers[layerName as keyof TrackedLayers]).toEqual({
        id: -1,
        index: layerName,
        objects: [],
      });
    }

    expect(trackedState.layers[LayerType.Plants]).toEqual({
      id: -1,
      index: 'plants',
      objects: [],
      loadedObjects: [],
    });

    expect(trackedState.layers[LayerType.Base]).toMatchObject({
      id: -1,
      index: 'base',
      layerId: 0,
      rotation: 0,
      scale: 100,
      nextcloudImagePath: '',
    });
  });

  it('adds a history entry for each call to executeAction', () => {
    const { executeAction } = useMapStore.getState();
    const createAction = new CreatePlantAction([createPlantTestObject(1)]);

    executeAction(createAction);

    const { trackedState, history } = useMapStore.getState();
    expect(history).toHaveLength(1);
    expect(trackedState.layers.plants.objects).toHaveLength(1);
  });

  it('it adds an entry to the history that is the inverse of the action', () => {
    const { executeAction } = useMapStore.getState();
    const createAction = new CreatePlantAction([createPlantTestObject(1)]);

    executeAction(createAction);

    const { history } = useMapStore.getState();
    expect(history).toHaveLength(1);
    expect(history[0]).toBeDefined();
    expect(history[0]).toEqual(createAction.reverse());
  });

  it('does not add a history entry for a remote action', () => {
    const { __applyRemoteAction } = useMapStore.getState();
    const createAction = new CreatePlantAction([createPlantTestObject(1)]);

    __applyRemoteAction(createAction);

    const { trackedState, history } = useMapStore.getState();
    expect(history).toHaveLength(0);
    expect(trackedState.layers.plants.objects).toHaveLength(1);
  });

  it('adds plant objects to the plants layer on CreatePlantAction', () => {
    const { executeAction } = useMapStore.getState();
    const createAction1 = new CreatePlantAction([createPlantTestObject(1)]);
    const createAction2 = new CreatePlantAction([createPlantTestObject(2)]);

    executeAction(createAction1);
    executeAction(createAction2);

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.plants.objects).toHaveLength(2);
    expect(newState.layers.plants.objects[0]).toMatchObject({
      id: '1',
      x: 1,
      y: 1,
    });
    expect(newState.layers.plants.objects[1]).toMatchObject({
      id: '2',
      x: 2,
      y: 2,
    });
  });

  it("updates a single plants's position on MovePlantAction", () => {
    const { executeAction } = useMapStore.getState();
    const createAction = new CreatePlantAction([createPlantTestObject(1)]);
    const moveAction = new MovePlantAction([
      {
        id: '1',
        x: 123,
        y: 123,
      },
    ]);

    executeAction(createAction);
    executeAction(moveAction);

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.plants.objects).toHaveLength(1);
    expect(newState.layers.plants.objects[0]).toMatchObject({
      id: '1',
      x: 123,
      y: 123,
    });
  });

  it("updates a single plants's transform on TransformPlantAction", () => {
    const { executeAction } = useMapStore.getState();
    const createAction = new CreatePlantAction([createPlantTestObject(1)]);
    const transformAction = new TransformPlantAction([
      {
        id: '1',
        x: 123,
        y: 123,
        rotation: 123,
        scaleX: 1.23,
        scaleY: 1.23,
      },
    ]);

    executeAction(createAction);
    executeAction(transformAction);

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.plants.objects).toHaveLength(1);
    expect(newState.layers.plants.objects[0]).toMatchObject({
      id: '1',
      x: 123,
      y: 123,
      rotation: 123,
      scaleX: 1.23,
      scaleY: 1.23,
    });
  });

  it('updates multiple plants on MovePlantAction', () => {
    const { executeAction } = useMapStore.getState();
    const createAction1 = new CreatePlantAction([createPlantTestObject(1)]);
    const createAction2 = new CreatePlantAction([createPlantTestObject(2)]);
    const moveAction = new MovePlantAction([
      {
        id: '1',
        x: 111,
        y: 111,
      },
      {
        id: '2',
        x: 222,
        y: 222,
      },
    ]);

    executeAction(createAction1);
    executeAction(createAction2);
    executeAction(moveAction);

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.plants.objects).toHaveLength(2);
    expect(newState.layers.plants.objects[0]).toMatchObject({
      id: '1',
      x: 111,
      y: 111,
    });
    expect(newState.layers.plants.objects[1]).toMatchObject({
      id: '2',
      x: 222,
      y: 222,
    });
  });

  it('updates multiple objects on TransformPlatAction', () => {
    const { executeAction } = useMapStore.getState();
    const createAction1 = new CreatePlantAction([createPlantTestObject(1)]);
    const createAction2 = new CreatePlantAction([createPlantTestObject(2)]);
    const transformAction = new TransformPlantAction([
      {
        id: '1',
        x: 111,
        y: 111,
        rotation: 111,
        scaleX: 1.11,
        scaleY: 1.11,
      },
      {
        id: '2',
        x: 222,
        y: 222,
        rotation: 222,
        scaleX: 2.22,
        scaleY: 2.22,
      },
    ]);

    executeAction(createAction1);
    executeAction(createAction2);
    executeAction(transformAction);

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.plants.objects).toHaveLength(2);
    expect(newState.layers.plants.objects[0]).toMatchObject({
      id: '1',
      x: 111,
      y: 111,
      rotation: 111,
      scaleX: 1.11,
      scaleY: 1.11,
    });
    expect(newState.layers.plants.objects[1]).toMatchObject({
      id: '2',
      x: 222,
      y: 222,
      rotation: 222,
      scaleX: 2.22,
      scaleY: 2.22,
    });
  });

  it('reverts one action on undo()', () => {
    const { executeAction } = useMapStore.getState();
    const createAction = new CreatePlantAction([createPlantTestObject(1)]);
    const moveAction = new MovePlantAction([
      {
        id: '1',
        x: 111,
        y: 111,
      },
    ]);

    executeAction(createAction);
    executeAction(moveAction);
    useMapStore.getState().undo();

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.plants.objects).toHaveLength(1);
    expect(newState.layers.plants.objects[0]).toEqual(createPlantTestObject(1));

    useMapStore.getState().undo();

    const { trackedState: newState2 } = useMapStore.getState();
    expect(newState2.layers.plants.objects).toHaveLength(0);
  });

  it('reverts multiple plants to their original position on undo()', () => {
    const { executeAction } = useMapStore.getState();
    const createAction1 = new CreatePlantAction([createPlantTestObject(1)]);
    const createAction2 = new CreatePlantAction([createPlantTestObject(2)]);
    const moveAction = new MovePlantAction([
      {
        id: '1',
        x: 111,
        y: 111,
      },
      {
        id: '2',
        x: 222,
        y: 222,
      },
    ]);

    executeAction(createAction1);
    executeAction(createAction2);
    executeAction(moveAction);

    useMapStore.getState().undo();

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.plants.objects).toHaveLength(2);
    expect(newState.layers.plants.objects[0]).toEqual(createPlantTestObject(1));
    expect(newState.layers.plants.objects[1]).toEqual(createPlantTestObject(2));
  });

  it('repeats one action per redo() after undo()', () => {
    const { executeAction } = useMapStore.getState();

    const createAction = new CreatePlantAction([createPlantTestObject(1)]);
    const moveAction = new MovePlantAction([
      {
        id: '1',
        x: 111,
        y: 111,
      },
    ]);

    executeAction(createAction);
    executeAction(moveAction);
    useMapStore.getState().undo();
    useMapStore.getState().redo();

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.plants.objects).toHaveLength(1);
    expect(newState.layers.plants.objects[0]).toMatchObject({
      id: '1',
      x: 111,
      y: 111,
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

    useMapStore.getState().updateSelectedLayer(createTestLayerObject());

    const { untrackedState: newState } = useMapStore.getState();

    if (typeof newState.selectedLayer !== 'object') {
      expect(true).toEqual(false);
      return;
    }

    expect(newState.selectedLayer.type_).toEqual(LayerType.Soil);
  });

  // regression
  it('does not change the selectedLayer after an undo()', () => {
    useMapStore.setState({
      untrackedState: {
        ...UNTRACKED_DEFAULT_STATE,
      },
      trackedState: {
        ...TRACKED_DEFAULT_STATE,
      },
    });

    useMapStore.getState().updateSelectedLayer(createTestLayerObject());

    const { executeAction } = useMapStore.getState();
    const createAction = new CreatePlantAction([createPlantTestObject(1)]);

    executeAction(createAction);
    useMapStore.getState().undo();

    const { untrackedState: newState } = useMapStore.getState();

    if (typeof newState.selectedLayer !== 'object') {
      expect(true).toEqual(false);
      return;
    }

    expect(newState.selectedLayer.type_).toEqual(LayerType.Soil);
  });
});

function initPlantLayerInStore(objects: PlantingDto[] = []) {
  useMapStore.setState({
    untrackedState: {
      ...UNTRACKED_DEFAULT_STATE,
    },
    trackedState: {
      ...TRACKED_DEFAULT_STATE,
      layers: {
        ...TRACKED_DEFAULT_STATE.layers,
        plants: {
          ...TRACKED_DEFAULT_STATE.layers.plants,
          objects,
        },
      },
    },
  });
}

function createTestLayerObject(): LayerDto {
  return { id: -1, map_id: -1, type_: LayerType.Soil, name: 'Test Layer', is_alternative: false };
}

function createPlantTestObject(testValue: number): PlantingDto {
  return {
    id: testValue.toString(),
    layerId: 1,
    plantId: 1,
    height: testValue,
    width: testValue,
    x: testValue,
    y: testValue,
    rotation: testValue,
    scaleX: testValue,
    scaleY: testValue,
    isArea: false,
  };
}
