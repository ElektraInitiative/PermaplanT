import { useTranslation } from 'react-i18next';
import IconButton from '@/components/Button/IconButton';
import { StatusPanelContentWrapper } from '@/features/map_planning/components/statuspanel/StatusPanelContentWrapper';
import useMapStore from '@/features/map_planning/store/MapStore';
import EraserIcon from '@/svg/icons/eraser.svg?react';
import PencilPlusIcon from '@/svg/icons/pencil-plus.svg?react';
import PointerIcon from '@/svg/icons/pointer.svg?react';

export function ShadingGeometryToolForm() {
  const { t } = useTranslation('shadeLayer');
  const movePolygonPoints = useMapStore((store) => store.shadeLayerActivateMovePolygonPoints);
  const addPolygonPoints = useMapStore((store) => store.shadeLayerActivateAddPolygonPoints);
  const removePolygonPoints = useMapStore((store) => store.shadeLayerActivateDeletePolygonPoints);
  const deactivatePolygonManipulation = useMapStore(
    (store) => store.shadeLayerDeactivatePolygonManipulation,
  );
  const setStatusPanelContent = useMapStore((store) => store.setStatusPanelContent);
  const setInhibitTransformer = useMapStore((store) => store.setInhibitTransformer);

  const onStatusPanelClose = () => {
    deactivatePolygonManipulation();
    setInhibitTransformer(false);
  };

  return (
    <div>
      <h6>{t('geometry_tool_form.title')}</h6>
      <div className="flex flex-row gap-1">
        <IconButton
          isToolboxIcon={true}
          title={t('geometry_tool_form.move_points')}
          onClick={() => {
            movePolygonPoints();
            setInhibitTransformer(true);
            setStatusPanelContent(
              <StatusPanelContentWrapper
                content={t('edit_polygon.move')}
                onClose={onStatusPanelClose}
              />,
            );
          }}
        >
          <PointerIcon></PointerIcon>
        </IconButton>
        <IconButton
          isToolboxIcon={true}
          title={t('geometry_tool_form.add_points')}
          onClick={() => {
            addPolygonPoints();
            setInhibitTransformer(true);
            setStatusPanelContent(
              <StatusPanelContentWrapper
                content={t('edit_polygon.add')}
                onClose={onStatusPanelClose}
              />,
            );
          }}
        >
          <PencilPlusIcon></PencilPlusIcon>
        </IconButton>
        <IconButton
          isToolboxIcon={true}
          title={t('geometry_tool_form.delete_points')}
          onClick={() => {
            removePolygonPoints();
            setInhibitTransformer(true);
            setStatusPanelContent(
              <StatusPanelContentWrapper
                content={t('edit_polygon.remove')}
                onClose={onStatusPanelClose}
              />,
            );
          }}
        >
          <EraserIcon></EraserIcon>
        </IconButton>
      </div>
    </div>
  );
}