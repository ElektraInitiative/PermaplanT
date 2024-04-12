import { useTranslation } from 'react-i18next';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import useMapStore from '../../store/MapStore';
import { DrawingLayerIconCreationForm } from './DrawingLayerIconCreationForm';
import { DrawingLayerLabelCreationForm } from './DrawingLayerLabelCreationForm';
import { DrawingLayerShapesCreationForm } from './DrawingLayerShapesCreationForm';
import 'react-tabs/style/react-tabs.css';

export const DrawingLayerRightToolbar = () => {
  const { t } = useTranslation(['drawings']);

  const drawingLayerClearSelectedShape = useMapStore(
    (state) => state.drawingLayerClearSelectedShape,
  );

  return (
    <div className="flex flex-col gap-2 p-2">
      <Tabs onSelect={drawingLayerClearSelectedShape}>
        <TabList>
          <Tab>{t('drawings:drawing_layer_right_toolbar.tab_headers.shapes')}</Tab>
          <Tab> {t('drawings:drawing_layer_right_toolbar.tab_headers.text')}</Tab>
          <Tab> {t('drawings:drawing_layer_right_toolbar.tab_headers.images')}</Tab>
        </TabList>

        <TabPanel>
          <DrawingLayerShapesCreationForm />
        </TabPanel>
        <TabPanel>
          <DrawingLayerLabelCreationForm />
        </TabPanel>
        <TabPanel>
          <DrawingLayerIconCreationForm />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default DrawingLayerRightToolbar;
