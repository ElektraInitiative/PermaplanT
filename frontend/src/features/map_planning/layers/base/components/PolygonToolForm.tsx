import IconButton from '@/components/Button/IconButton';
import useMapStore from '@/features/map_planning/store/MapStore';
import { ReactComponent as CloseIcon } from '@/svg/icons/close.svg';
import { ReactComponent as EraserIcon } from '@/svg/icons/eraser.svg';
import { ReactComponent as PencilPlusIcon } from '@/svg/icons/pencil-plus.svg';
import { ReactComponent as PointerIcon } from '@/svg/icons/pointer.svg';
import { useTranslation } from 'react-i18next';

export function PolygonToolForm() {
  const { t } = useTranslation(['common', 'baseLayerForm']);

  const activatePolygonAddPoints = useMapStore((state) => state.baseLayerActivateAddPolygonPoints);
  const activatePolygonMovePoints = useMapStore(
    (state) => state.baseLayerActivateMovePolygonPoints,
  );
  const activatePolygonDeletePoints = useMapStore(
    (state) => state.baseLayerActivateDeletePolygonPoints,
  );
  const setStatusPanelContent = useMapStore((state) => state.setStatusPanelContent);

  return (
    <div>
      <h2>{t('baseLayerForm:polygon_tools_title')}</h2>
      <div className="flex flex-row gap-1">
        <IconButton
          isToolboxIcon={true}
          onClick={() => {
            activatePolygonMovePoints();
            setStatusPanelContent(
              <PolygonStatusPanelContent text={t('baseLayerForm:polygon_move_points_hint')} />,
            );
          }}
          title={t('baseLayerForm:polygon_move_points_tooltip')}
        >
          <PointerIcon></PointerIcon>
        </IconButton>
        <IconButton
          isToolboxIcon={true}
          onClick={() => {
            activatePolygonAddPoints();
            setStatusPanelContent(
              <PolygonStatusPanelContent text={t('baseLayerForm:polygon_add_points_hint')} />,
            );
          }}
          title={t('baseLayerForm:polygon_add_points_tooltip')}
        >
          <PencilPlusIcon></PencilPlusIcon>
        </IconButton>
        <IconButton
          isToolboxIcon={true}
          onClick={() => {
            activatePolygonDeletePoints();
            setStatusPanelContent(
              <PolygonStatusPanelContent text={t('baseLayerForm:polygon_delete_points_hint')} />,
            );
          }}
          title={t('baseLayerForm:polygon_delete_points_tooltip')}
        >
          <EraserIcon></EraserIcon>
        </IconButton>
      </div>
    </div>
  );
}

function PolygonStatusPanelContent(props: { text: string }) {
  const deactivatePolygonManipulation = useMapStore(
    (state) => state.baseLayerDeactivatePolygonManipulation,
  );
  const clearStatusPanelContent = useMapStore((state) => state.clearStatusPanelContent);

  return (
    <>
      <div className="flex flex-row items-center justify-center">{props.text}</div>
      <div className="flex items-center justify-center">
        <IconButton
          className="m-2 h-8 w-8 border border-neutral-500 p-1"
          onClick={() => {
            deactivatePolygonManipulation();
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
