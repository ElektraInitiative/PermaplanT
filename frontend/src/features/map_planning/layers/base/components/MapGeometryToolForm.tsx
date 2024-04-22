import { useTranslation } from 'react-i18next';
import IconButton from '@/components/Button/IconButton';
import {
  KEYBINDINGS_SCOPE_BASE_LAYER,
  createKeyBindingsAccordingToConfig,
  useGetFormattedKeybindingDescriptionForAction,
} from '@/config/keybindings';
import { StatusPanelContentWrapper } from '@/features/map_planning/components/statuspanel/StatusPanelContentWrapper';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useIsBaseLayerActive } from '@/features/map_planning/utils/layer-utils';
import { useKeyHandlers } from '@/hooks/useKeyHandlers';
import EraserIcon from '@/svg/icons/eraser.svg?react';
import PencilPlusIcon from '@/svg/icons/pencil-plus.svg?react';
import PointerIcon from '@/svg/icons/pointer.svg?react';

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
  const isBaseLayerActive = useIsBaseLayerActive();

  const onStatusPanelClose = () => {
    deactivatePolygonManipulation();
    clearStatusPanelContent();
  };

  const activatePolygonMovePointsAction = () => {
    activatePolygonMovePoints();
    setStatusPanelContent(
      <StatusPanelContentWrapper
        content={t('baseLayerForm:polygon_move_points_hint')}
        onClose={onStatusPanelClose}
      />,
    );
  };

  const activatePolygonAddPointsAction = () => {
    activatePolygonAddPoints();
    setStatusPanelContent(
      <StatusPanelContentWrapper
        content={t('baseLayerForm:polygon_add_points_hint')}
        onClose={onStatusPanelClose}
      />,
    );
  };

  const activatePolygonDeletePointsAction = () => {
    activatePolygonDeletePoints();
    setStatusPanelContent(
      <StatusPanelContentWrapper
        content={t('baseLayerForm:polygon_delete_points_hint')}
        onClose={onStatusPanelClose}
      />,
    );
  };

  const keyHandlerActions: Record<string, () => void> = {
    activatePolygonMovePoints: activatePolygonMovePointsAction,
    activatePolygonAddPoints: activatePolygonAddPointsAction,
    activatePolygonDeletePoints: activatePolygonDeletePointsAction,
  };

  useKeyHandlers(
    createKeyBindingsAccordingToConfig(KEYBINDINGS_SCOPE_BASE_LAYER, keyHandlerActions),
    document,
    true,
    isBaseLayerActive,
  );

  return (
    <div>
      <h2>{t('baseLayerForm:polygon_tools_title')}</h2>
      <div className="flex flex-row gap-1">
        <IconButton
          isToolboxIcon={true}
          onClick={() => {
            activatePolygonMovePointsAction();
          }}
          title={useGetFormattedKeybindingDescriptionForAction(
            KEYBINDINGS_SCOPE_BASE_LAYER,
            'activatePolygonMovePoints',
            t('baseLayerForm:polygon_move_points_tooltip'),
          )}
        >
          <PointerIcon></PointerIcon>
        </IconButton>
        <IconButton
          isToolboxIcon={true}
          onClick={() => {
            activatePolygonAddPointsAction();
          }}
          title={useGetFormattedKeybindingDescriptionForAction(
            KEYBINDINGS_SCOPE_BASE_LAYER,
            'activatePolygonAddPoints',
            t('baseLayerForm:polygon_add_points_tooltip'),
          )}
        >
          <PencilPlusIcon></PencilPlusIcon>
        </IconButton>
        <IconButton
          isToolboxIcon={true}
          onClick={() => {
            activatePolygonDeletePointsAction();
          }}
          title={useGetFormattedKeybindingDescriptionForAction(
            KEYBINDINGS_SCOPE_BASE_LAYER,
            'activatePolygonDeletePoints',
            t('baseLayerForm:polygon_delete_points_tooltip'),
          )}
        >
          <EraserIcon></EraserIcon>
        </IconButton>
      </div>
    </div>
  );
}
