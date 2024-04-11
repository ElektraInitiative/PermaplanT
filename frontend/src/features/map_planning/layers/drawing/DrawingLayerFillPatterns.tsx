import { useTranslation } from 'react-i18next';
import { FillPatternType } from '@/api_types/definitions';
import IconButton from '@/components/Button/IconButton';
import NoFillIcon from '@/svg/icons/forbid.svg?react';
import SquareFilled from '@/svg/icons/square-filled.svg?react';
import TextureIcon from '@/svg/icons/texture.svg?react';
import CrosshatchIcon from '@/svg/icons/track.svg?react';

interface DrawingLayerFillPatternProps {
  selectedPattern: FillPatternType;
  onChange: (pattern: FillPatternType) => void;
}

export function DrawingLayerFillPatterns({
  onChange,
  selectedPattern,
}: DrawingLayerFillPatternProps) {
  const { t } = useTranslation(['common', 'drawings']);

  return (
    <>
      <div>
        <span className="mb-2 block text-sm font-medium">{t('drawings:fillPattern')}</span>
        <div className="flex flex-row gap-1">
          <IconButton
            isToolboxIcon={true}
            renderAsActive={selectedPattern === 'none'}
            onClick={() => {
              onChange(FillPatternType.None);
            }}
            title={t('drawings:draw_free_line_tooltip')}
          >
            <NoFillIcon></NoFillIcon>
          </IconButton>
          <IconButton
            isToolboxIcon={true}
            renderAsActive={selectedPattern === 'hatch'}
            onClick={() => {
              onChange(FillPatternType.Hatch);
            }}
            title={t('drawings:draw_free_line_tooltip')}
          >
            <TextureIcon></TextureIcon>
          </IconButton>
          <IconButton
            isToolboxIcon={true}
            renderAsActive={selectedPattern === 'crosshatch'}
            onClick={() => {
              onChange(FillPatternType.CrossHatch);
            }}
            title={t('drawings:draw_rectangle_tooltip')}
          >
            <CrosshatchIcon></CrosshatchIcon>
          </IconButton>

          <IconButton
            isToolboxIcon={true}
            renderAsActive={selectedPattern === 'fill'}
            onClick={() => {
              onChange(FillPatternType.Fill);
            }}
            title={t('drawings:draw_ellipse_tooltip')}
          >
            <SquareFilled></SquareFilled>
          </IconButton>
        </div>
      </div>
    </>
  );
}
