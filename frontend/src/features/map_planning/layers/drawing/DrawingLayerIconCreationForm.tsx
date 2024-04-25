import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileStat } from 'webdav';
import { DrawingShapeType } from '@/api_types/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import useMapStore from '@/features/map_planning/store/MapStore';
import FileSelectorModal from '@/features/nextcloud_integration/components/FileSelectorModal';
import { DrawingLayerStatusPanelContent } from './DrawingLayerStatusPanelContent';

export function DrawingLayerIconCreationForm() {
  const { t } = useTranslation(['common', 'drawings']);

  const [showFileSelector, setShowFileSelector] = useState(false);
  const setStatusPanelContent = useMapStore((state) => state.setStatusPanelContent);

  const drawingLayerActivateDrawingMode = useMapStore(
    (state) => state.drawingLayerActivateDrawingMode,
  );

  const drawingLayerSetSelectedIconPath = useMapStore(
    (state) => state.drawingLayerSetSelectedIconPath,
  );

  const handleSelectImage = (item: FileStat) => {
    const path = '/Photos/' + item.basename;
    drawingLayerActivateDrawingMode(DrawingShapeType.Image);
    drawingLayerSetSelectedIconPath(path);
    setStatusPanelContent(<DrawingLayerStatusPanelContent text={t('drawings:place_image_hint')} />);
    setShowFileSelector(false);
  };

  return (
    <>
      <div>
        <div className="flex flex-row gap-1">
          <FileSelectorModal
            setShow={function (show: boolean): void {
              setShowFileSelector(show);
            }}
            show={showFileSelector}
            onCancel={function (): void {
              setShowFileSelector(false);
            }}
            path={'/Photos/'}
            onSelect={function (item: FileStat): void {
              handleSelectImage(item);
            }}
            title={t('drawings:select_image')}
          />
          <SimpleButton onClick={() => setShowFileSelector(true)}>
            {t('drawings:select_image')}
          </SimpleButton>
        </div>
      </div>
    </>
  );
}
