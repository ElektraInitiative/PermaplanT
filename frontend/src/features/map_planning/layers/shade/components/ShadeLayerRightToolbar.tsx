import { useTranslation } from 'react-i18next';
import { Shade } from '@/api_types/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import { StatusPanelContentWrapper } from '@/features/map_planning/components/statuspanel/StatusPanelContentWrapper';
import useMapStore from '@/features/map_planning/store/MapStore';

export function ShadeLayerRightToolbar() {
  const { t } = useTranslation('shadeLayer');
  const selectShadeForNewShading = useMapStore((state) => state.shadeLayerSelectShadeForNewShading);
  const selectedShadeForNewShading = useMapStore(
    (state) => state.untrackedState.layers.shade.selectedShadeForNewShading,
  );
  const setStatusPanelContent = useMapStore((state) => state.setStatusPanelContent);
  const clearStatusPanelContent = useMapStore((state) => state.clearStatusPanelContent);

  const removeShadeForShading = () => {
    selectShadeForNewShading(null);
    clearStatusPanelContent();
  };

  const toggleShadeForShading = (shade: Shade) => {
    if (selectedShadeForNewShading === shade) {
      removeShadeForShading();
      return;
    }

    selectShadeForNewShading(shade);
    setStatusPanelContent(
      <StatusPanelContentWrapper
        onClose={removeShadeForShading}
        content={t('place_shadings_message')}
      />,
    );
  };

  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <SimpleButton onClick={() => toggleShadeForShading(Shade.LightShade)}>
        {t('shading_amount.light_shade')}
      </SimpleButton>
      <SimpleButton onClick={() => toggleShadeForShading(Shade.PartialShade)}>
        {t('shading_amount.partial_shade')}
      </SimpleButton>
      <SimpleButton onClick={() => toggleShadeForShading(Shade.PermanentShade)}>
        {t('shading_amount.permanent_shade')}
      </SimpleButton>
      <SimpleButton onClick={() => toggleShadeForShading(Shade.PermanentDeepShade)}>
        {t('shading_amount.permanent_deep_shade')}
      </SimpleButton>
    </div>
  );
}
