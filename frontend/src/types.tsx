interface LayerObject {
  visible: boolean;
  objects: {
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
  }[];
}


interface CanvasState {
  history: {
    stage: {
      scaleX: number;
      scaleY: number;
      stageX: number;
      stageY: number;
      layers: LayerObject[];
    };
  }[];
  historyStep: number;
}

export type { CanvasState, LayerObject };
