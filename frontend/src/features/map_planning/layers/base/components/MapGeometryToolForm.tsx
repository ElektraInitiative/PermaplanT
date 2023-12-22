import IconButton from '@/components/Button/IconButton';
import {
  KEYBINDINGS_SCOPE_BASE_LAYER,
  createKeyBindingsAccordingToConfig,
} from '@/config/keybindings';
import useMapStore from '@/features/map_planning/store/MapStore';
import { isBaseLayerActive } from '@/features/map_planning/utils/layer-utils';
import { useKeyHandlers } from '@/hooks/useKeyHandlers';
import CloseIcon from '@/svg/icons/close.svg?react';
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

  const activatePolygonMovePointsAction = () => {
    if (!isBaseLayerActive) return;

    activatePolygonMovePoints();
    setStatusPanelContent(
      <MapGeometryStatusPanelContent text={t('baseLayerForm:polygon_move_points_hint')} />,
    );
  };

  const activatePolygonAddPointsAction = () => {
    if (!isBaseLayerActive) return;

    activatePolygonAddPoints();
    setStatusPanelContent(
      <MapGeometryStatusPanelContent text={t('baseLayerForm:polygon_add_points_hint')} />,
    );
  };

  const activatePolygonDeletePointsAction = () => {
    if (!isBaseLayerActive) return;

    activatePolygonDeletePoints();
    setStatusPanelContent(
      <MapGeometryStatusPanelContent text={t('baseLayerForm:polygon_delete_points_hint')} />,
    );
  };

  const keyHandlerActions: Record<string, () => void> = {
    activatePolygonMovePoints: activatePolygonMovePointsAction,
    activatePolygonAddPoints: activatePolygonAddPointsAction,
    activatePolygonDeletePoints: activatePolygonDeletePointsAction,
  };

  useKeyHandlers(
    createKeyBindingsAccordingToConfig(KEYBINDINGS_SCOPE_BASE_LAYER, keyHandlerActions),
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
          title={t('baseLayerForm:polygon_move_points_tooltip')}
        >
          <PointerIcon></PointerIcon>
        </IconButton>
        <IconButton
          isToolboxIcon={true}
          onClick={() => {
            activatePolygonAddPointsAction();
          }}
          title={t('baseLayerForm:polygon_add_points_tooltip')}
        >
          <PencilPlusIcon></PencilPlusIcon>
        </IconButton>
        <IconButton
          isToolboxIcon={true}
          onClick={() => {
            activatePolygonDeletePointsAction();
          }}
          title={t('baseLayerForm:polygon_delete_points_tooltip')}
        >
          <EraserIcon></EraserIcon>
        </IconButton>
      </div>
    </div>
  );
}

function MapGeometryStatusPanelContent(props: { text: string }) {
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
