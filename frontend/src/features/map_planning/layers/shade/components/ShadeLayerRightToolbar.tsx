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

    let statusPanelContent;
    switch (shade) {
      case Shade.LightShade:
        statusPanelContent = t('place_light_shadings_message');
        break;
      case Shade.PartialShade:
        statusPanelContent = t('place_partial_shadings_message');
        break;
      case Shade.PermanentShade:
        statusPanelContent = t('place_permanent_shadings_message');
        break;
      case Shade.PermanentDeepShade:
        statusPanelContent = t('place_permanent_deep_shadings_message');
        break;
      default:
        // Should never happen
        statusPanelContent = '';
    }

    selectShadeForNewShading(shade);
    setStatusPanelContent(
      <StatusPanelContentWrapper onClose={removeShadeForShading} content={statusPanelContent} />,
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
      <div className="pt-8">
        <h2 className="pb-4">{t('right_toolbar.legend.title')}</h2>
        <ul>
          <li className="pb-4">
            <h3>
              {t('shading_amount.no_shade')} ({t('right_toolbar.legend.color_none')})
            </h3>
            <p className="text-[0.8rem] text-neutral-400">{t('right_toolbar.legend.no_shade')}</p>
          </li>
          <li className="pb-4">
            <h3>
              {t('shading_amount.light_shade')} (
              <span className="text-shadings-lightShade">
                {t('right_toolbar.legend.color_light_shade')}
              </span>
              ){' '}
            </h3>
            <p className="text-[0.8rem] text-neutral-400">
              {t('right_toolbar.legend.light_shade')}
            </p>
          </li>
          <li className="pb-4">
            <h3>
              {t('shading_amount.partial_shade')} (
              <span className="text-shadings-partialShade">
                {t('right_toolbar.legend.color_partial_shade')}
              </span>
              )
            </h3>
            <p className="text-[0.8rem] text-neutral-400">
              {t('right_toolbar.legend.partial_shade')}
            </p>
          </li>
          <li className="pb-4">
            <h3>
              {t('shading_amount.permanent_shade')} (
              <span className="text-shadings-permanentShade">
                {t('right_toolbar.legend.color_permanent_shade')}
              </span>
              )
            </h3>
            <p className="text-[0.8rem] text-neutral-400">
              {t('right_toolbar.legend.permanent_shade')}
            </p>
          </li>
          <li className="pb-4">
            <h3>
              {t('shading_amount.permanent_deep_shade')} (
              <span className="text-shadings-permanentDeepShade">
                {t('right_toolbar.legend.color_permanent_deep_shade')}
              </span>
              )
            </h3>
            <p className="text-[0.8rem] text-neutral-400">
              {t('right_toolbar.legend.permanent_deep_shade')}
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
