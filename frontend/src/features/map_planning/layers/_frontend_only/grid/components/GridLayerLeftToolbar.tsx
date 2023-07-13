import IconButton from '@/components/Button/IconButton';
import { NamedSlider } from '@/components/Slider/NamedSlider';
import { FrontendOnlyLayerType } from '@/features/map_planning/layers/_frontend_only';
import useMapStore from '@/features/map_planning/store/MapStore';
import { ReactComponent as EyeOffIcon } from '@/icons/eye-off.svg';
import { ReactComponent as EyeIcon } from '@/icons/eye.svg';
import { useTranslation } from 'react-i18next';

export const GridLayerLeftToolbar = () => {
  const { t } = useTranslation(['grid', 'layerSettings']);
  const layerVisible = useMapStore((map) => map.untrackedState.layers['grid'].visible);
  const updateLayerVisible = useMapStore((map) => map.updateLayerVisible);
  const setLayerOpacity = useMapStore((map) => map.updateLayerOpacity);

  return (
    <div>
      <h2 className="m-2 text-center">{t('grid:settings_header')}</h2>
      <div className="m-2 grid grid-cols-2 grid-cols-[1.5rem_minmax(0,_1fr)] gap-2">
        <div className="flex items-center justify-center">
          <IconButton
            title={t('layerSettings:show_hide_layer')}
            onClick={() => updateLayerVisible(FrontendOnlyLayerType.Grid, !layerVisible)}
          >
            {layerVisible ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
          </IconButton>
        </div>
        <div className="flex items-center">
          <NamedSlider
            onChange={(percentage) => {
              if (setLayerOpacity) setLayerOpacity(FrontendOnlyLayerType.Grid, percentage);
            }}
            title={t('layerSettings:sliderTooltip')}
            value={1}
          >
            {t(`grid:visibility_slider`)}
          </NamedSlider>
        </div>
      </div>
    </div>
  );
};
