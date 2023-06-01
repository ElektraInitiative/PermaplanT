import { CreatePlantAction, MovePlantAction } from '../layers/plant/actions';
import useMapStore from './MapStore';
import { TrackedLayers } from './MapStoreTypes';
import { TRACKED_DEFAULT_STATE } from './TrackedMapStore';
import { UNTRACKED_DEFAULT_STATE } from './UntrackedMapStore';
import { PlantLayerObjectDto } from '@/bindings/definitions';

// mock the axios api configuration, so that we don't actually send requests to the backend
jest.mock('@/config/axios');

describe('MapHistoryStore', () => {
  it('creates empty layers for each LayerName', () => {
    initPlantLayerInStore();
    const { trackedState } = useMapStore.getState();

    expect(trackedState).toBeDefined();

    for (const layerName of Object.keys(trackedState.layers)) {
      expect(trackedState.layers[layerName as keyof TrackedLayers]).toEqual({
        index: layerName,
        objects: [],
      });
    }
  });

  it('adds plant objects to the plants layer on CreatePlantAction', () => {
    const { executeAction } = useMapStore.getState();
    const createAction1 = new CreatePlantAction(createPlantTestObject(1));
    const createAction2 = new CreatePlantAction(createPlantTestObject(2));

    executeAction(createAction1);
    executeAction(createAction2);

    const { trackedState: newState } = useMapStore.getState();
    expect(newState.layers.Plant.objects).toHaveLength(2);
    expect(newState.layers.Plant.objects[0]).toMatchObject({
      id: '1',
      x: 1,
      y: 1,
    });
    expect(newState.layers.Plant.objects[1]).toMatchObject({
      id: '2',
      x: 2,
      y: 2,
    });
  });

  it("updates a single plants's position on MovePlantAction", () => {
    const { executeAction } = useMapStore.getState();
    const createAction = new CreatePlantAction(createPlantTestObject(1));
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
    expect(newState.layers.Plant.objects).toHaveLength(1);
    expect(newState.layers.Plant.objects[0]).toMatchObject({
      id: '1',
      x: 123,
      y: 123,
    });
  });

  // it("updates a single object's transform on ObjectUpdateTransformAction", () => {
  //   const { dispatch } = useMapStore.getState();

  //   dispatch({
  //     type: 'OBJECT_ADD',
  //     payload: createPlantTestObject(1),
  //   });

  //   dispatch({
  //     type: 'OBJECT_UPDATE_POSITION',
  //     payload: [
  //       {
  //         id: '1',
  //         index: 'Plant',
  //         type: 'plant',
  //         x: 100,
  //         y: 100,
  //         height: 200,
  //         width: 200,
  //         rotation: 300,
  //         scaleX: 1,
  //         scaleY: 1,
  //       },
  //     ],
  //   });

  //   const { trackedState: newState } = useMapStore.getState();
  //   expect(newState.layers.Plant.objects).toHaveLength(1);
  //   expect(newState.layers.Plant.objects[0]).toMatchObject({
  //     id: '1',
  //     x: 100,
  //     y: 100,
  //     height: 200,
  //     width: 200,
  //     rotation: 300,
  //     scaleX: 1,
  //     scaleY: 1,
  //   });
  // });

  it('updates multiple plants on MovePlantAction', () => {
    const { executeAction } = useMapStore.getState();
    const createAction1 = new CreatePlantAction(createPlantTestObject(1));
    const createAction2 = new CreatePlantAction(createPlantTestObject(2));
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
    expect(newState.layers.Plant.objects).toHaveLength(2);
    expect(newState.layers.Plant.objects[0]).toMatchObject({
      id: '1',
      x: 111,
      y: 111,
    });
    expect(newState.layers.Plant.objects[1]).toMatchObject({
      id: '2',
      x: 222,
      y: 222,
    });
  });

  // it('updates multiple objects on ObjectUpdateTransformAction', () => {
  //   const { dispatch } = useMapStore.getState();

  //   dispatch({
  //     type: 'OBJECT_ADD',
  //     payload: createPlantTestObject(1),
  //   });
  //   dispatch({
  //     type: 'OBJECT_ADD',
  //     payload: createPlantTestObject(2),
  //   });

  //   dispatch({
  //     type: 'OBJECT_UPDATE_TRANSFORM',
  //     payload: [
  //       {
  //         id: '1',
  //         index: 'Plant',
  //         type: 'plant',
  //         x: 123,
  //         y: 123,
  //         height: 345,
  //         width: 345,
  //         rotation: 345,
  //         scaleX: 345,
  //         scaleY: 345,
  //       },
  //       {
  //         id: '2',
  //         index: 'Plant',
  //         type: 'plant',
  //         x: 123,
  //         y: 123,
  //         height: 345,
  //         width: 345,
  //         rotation: 345,
  //         scaleX: 345,
  //         scaleY: 345,
  //       },
  //     ],
  //   });

  //   const { trackedState: newState } = useMapStore.getState();
  //   expect(newState.layers.Plant.objects).toHaveLength(2);
  //   expect(newState.layers.Plant.objects[0]).toMatchObject({
  //     id: '1',
  //     x: 123,
  //     y: 123,
  //   });
  //   expect(newState.layers.Plant.objects[1]).toMatchObject({
  //     id: '2',
  //     x: 123,
  //     y: 123,
  //   });
  // });

  it('reverts one action on undo()', () => {
    const { executeAction } = useMapStore.getState();
    const createAction = new CreatePlantAction(createPlantTestObject(1));
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
    expect(newState.layers.Plant.objects).toHaveLength(1);
    expect(newState.layers.Plant.objects[0]).toEqual(createPlantTestObject(1));

    useMapStore.getState().undo();

    const { trackedState: newState2 } = useMapStore.getState();
    expect(newState2.layers.Plant.objects).toHaveLength(0);
  });

  it('reverts multiple plants to their original position on undo()', () => {
    const { executeAction } = useMapStore.getState();
    const createAction1 = new CreatePlantAction(createPlantTestObject(1));
    const createAction2 = new CreatePlantAction(createPlantTestObject(2));
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
    expect(newState.layers.Plant.objects).toHaveLength(2);
    expect(newState.layers.Plant.objects[0]).toEqual(createPlantTestObject(1));
    expect(newState.layers.Plant.objects[1]).toEqual(createPlantTestObject(2));
  });

  it('repeats one action per redo() after undo()', () => {
    const { executeAction } = useMapStore.getState();

    const createAction = new CreatePlantAction(createPlantTestObject(1));
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
    expect(newState.layers.Plant.objects).toHaveLength(1);
    expect(newState.layers.Plant.objects[0]).toMatchObject({
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
    const { executeAction } = useMapStore.getState();
    const createAction = new CreatePlantAction(createPlantTestObject(1));

    executeAction(createAction);
    useMapStore.getState().undo();

    const { untrackedState: newState } = useMapStore.getState();
    expect(newState.selectedLayer).toEqual('Soil');
  });
});

function initPlantLayerInStore(objects: PlantLayerObjectDto[] = []) {
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

function createPlantTestObject(testValue: number): PlantLayerObjectDto {
  return {
    id: testValue.toString(),
    plantId: 1,
    height: testValue,
    width: testValue,
    x: testValue,
    y: testValue,
    rotation: testValue,
    scaleX: testValue,
    scaleY: testValue,
  };
}
