import { DrawingLayerToolForm } from './DrawingLayerToolForm';

export const DrawingLayerRightToolbar = () => {
  return (
    <div className="flex flex-col gap-2 p-2">
      <DrawingLayerToolForm />
    </div>
  );
};

export default DrawingLayerRightToolbar;
