import IconButton from '@/components/Button/IconButton';
import useMapStore from '@/features/map_planning/store/MapStore';
import { ReactComponent as CircleIcon } from '@/svg/icons/circle.svg';
import { ReactComponent as CloseIcon } from '@/svg/icons/close.svg';
import { ReactComponent as RectangleIcon } from '@/svg/icons/rectangle.svg';
import { ReactComponent as LineIcon } from '@/svg/icons/wavy-line.svg';
import { useTranslation } from 'react-i18next';

export function DrawingLayerToolForm() {
  const { t } = useTranslation(['common', 'baseLayerForm']);

  const drawingLayerActivateFreeDrawing = useMapStore(
    (state) => state.drawingLayerActivateFreeDrawing,
  );
  const drawingLayerActivateRectangleDrawing = useMapStore(
    (state) => state.drawingLayerActivateDrawRectangle,
  );
  const drawingLayerActivateDrawEllipse = useMapStore(
    (state) => state.drawingLayerActivateDrawEllipse,
  );

  const setStatusPanelContent = useMapStore((state) => state.setStatusPanelContent);

  return (
    <div>
      <h2>Form auswählen</h2>
      <div className="flex flex-row gap-1">
        <IconButton
          isToolboxIcon={true}
          onClick={() => {
            drawingLayerActivateFreeDrawing();
            setStatusPanelContent(<DrawingLayerStatusPanelContent text="Free Drawing" />);
          }}
          title={t('baseLayerForm:polygon_move_points_tooltip')}
        >
          <LineIcon></LineIcon>
        </IconButton>
        <IconButton
          isToolboxIcon={true}
          onClick={() => {
            drawingLayerActivateRectangleDrawing();
            setStatusPanelContent(<DrawingLayerStatusPanelContent text="Draw Rectangle" />);
          }}
          title={t('baseLayerForm:polygon_add_points_tooltip')}
        >
          <RectangleIcon></RectangleIcon>
        </IconButton>

        <IconButton
          isToolboxIcon={true}
          onClick={() => {
            drawingLayerActivateDrawEllipse();
            setStatusPanelContent(<DrawingLayerStatusPanelContent text="Draw Ellipse" />);
          }}
          title={t('baseLayerForm:polygon_add_points_tooltip')}
        >
          <CircleIcon></CircleIcon>
        </IconButton>
      </div>
    </div>
  );
}

function DrawingLayerStatusPanelContent(props: { text: string }) {
  const clearStatusPanelContent = useMapStore((state) => state.clearStatusPanelContent);

  return (
    <>
      <div className="flex flex-row items-center justify-center">{props.text}</div>
      <div className="flex items-center justify-center">
        <IconButton
          className="m-2 h-8 w-8 border border-neutral-500 p-1"
          onClick={() => {
            clearStatusPanelContent();
          }}
          data-tourid="placement_cancel"
        >
          <CloseIcon></CloseIcon>
        </IconButton>
      </div>
    </>
  );
}
