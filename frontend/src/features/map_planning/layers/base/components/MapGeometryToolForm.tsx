import IconButton from '@/components/Button/IconButton';
import { StatusPanelContentWrapper } from '@/features/map_planning/components/statuspanel/StatusPanelContentWrapper';
import useMapStore from '@/features/map_planning/store/MapStore';
import EraserIcon from '@/svg/icons/eraser.svg?react';
import PencilPlusIcon from '@/svg/icons/pencil-plus.svg?react';
import PointerIcon from '@/svg/icons/pointer.svg?react';
import { useTranslation } from 'react-i18next';

export function MapGeometryToolForm() {
  const { t } = useTranslation(['common', 'baseLayerForm']);

  const activatePolygonAddPoints = useMapStore((state) => state.baseLayerActivateAddPolygonPoints);
  const activatePolygonMovePoints = useMapStore(
    (state) => state.baseLayerActivateMovePolygonPoints,
  );
  const activatePolygonDeletePoints = useMapStore(
    (state) => state.baseLayerActivateDeletePolygonPoints,
  );
  const setStatusPanelContent = useMapStore((state) => state.setStatusPanelContent);
  const deactivatePolygonManipulation = useMapStore(
    (state) => state.baseLayerDeactivatePolygonManipulation,
  );
  const clearStatusPanelContent = useMapStore((state) => state.clearStatusPanelContent);

  const onStatusPanelClose = () => {
    deactivatePolygonManipulation();
    clearStatusPanelContent();
  };

  return (
    <div>
      <h2>{t('baseLayerForm:polygon_tools_title')}</h2>
      <div className="flex flex-row gap-1">
        <IconButton
          isToolboxIcon={true}
          onClick={() => {
            activatePolygonMovePoints();
            setStatusPanelContent(
              <StatusPanelContentWrapper
                content={t('baseLayerForm:polygon_move_points_hint')}
                onClose={onStatusPanelClose}
              />,
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
              <StatusPanelContentWrapper
                content={t('baseLayerForm:polygon_add_points_hint')}
                onClose={onStatusPanelClose}
              />,
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
              <StatusPanelContentWrapper
                content={t('baseLayerForm:polygon_delete_points_hint')}
                onClose={onStatusPanelClose}
              />,
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
