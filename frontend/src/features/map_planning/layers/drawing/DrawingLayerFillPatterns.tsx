import { useTranslation } from 'react-i18next';
import { FillPatternType } from '@/api_types/definitions';
import IconButton from '@/components/Button/IconButton';
import NoFillIcon from '@/svg/icons/forbid.svg?react';
import PointsPatternIcon from '@/svg/icons/points.svg?react';
import SquareFilled from '@/svg/icons/square-filled.svg?react';
import HatchDownIcon from '@/svg/icons/texture_down.svg?react';
import HatchUpIcon from '@/svg/icons/texture_up.svg?react';
import CrosshatchIcon from '@/svg/icons/track.svg?react';
import WaveIcon from '@/svg/icons/wavy-line.svg?react';

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
        <div className="flex flex-row flex-wrap gap-1">
          <IconButton
            isToolboxIcon={true}
            renderAsActive={selectedPattern === FillPatternType.None}
            onClick={() => {
              onChange(FillPatternType.None);
            }}
          >
            <NoFillIcon></NoFillIcon>
          </IconButton>
          <IconButton
            isToolboxIcon={true}
            renderAsActive={selectedPattern === FillPatternType.HatchDown}
            onClick={() => {
              onChange(FillPatternType.HatchDown);
            }}
          >
            <HatchDownIcon></HatchDownIcon>
          </IconButton>
          <IconButton
            isToolboxIcon={true}
            renderAsActive={selectedPattern === FillPatternType.HatchUp}
            onClick={() => {
              onChange(FillPatternType.HatchUp);
            }}
          >
            <HatchUpIcon></HatchUpIcon>
          </IconButton>
          <IconButton
            isToolboxIcon={true}
            renderAsActive={selectedPattern === FillPatternType.CrossHatch}
            onClick={() => {
              onChange(FillPatternType.CrossHatch);
            }}
          >
            <CrosshatchIcon></CrosshatchIcon>
          </IconButton>

          <IconButton
            isToolboxIcon={true}
            renderAsActive={selectedPattern === FillPatternType.Points}
            onClick={() => {
              onChange(FillPatternType.Points);
            }}
          >
            <PointsPatternIcon></PointsPatternIcon>
          </IconButton>

          <IconButton
            isToolboxIcon={true}
            renderAsActive={selectedPattern === FillPatternType.Wave}
            onClick={() => {
              onChange(FillPatternType.Wave);
            }}
          >
            <WaveIcon></WaveIcon>
          </IconButton>

          <IconButton
            isToolboxIcon={true}
            renderAsActive={selectedPattern === FillPatternType.Fill}
            onClick={() => {
              onChange(FillPatternType.Fill);
            }}
          >
            <SquareFilled></SquareFilled>
          </IconButton>
        </div>
      </div>
    </>
  );
}
