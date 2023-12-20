import IconButton from '@/components/Button/IconButton';
import EraserIcon from '@/svg/icons/eraser.svg?react';
import PencilPlusIcon from '@/svg/icons/pencil-plus.svg?react';
import PointerIcon from '@/svg/icons/pointer.svg?react';
import { useTranslation } from 'react-i18next';

export function ShadingGeometryToolForm() {
  const { t } = useTranslation('shadeLayer');
  return (
    <div>
      <h6>{t('geometry_tool_form.title')}</h6>
      <div className="flex flex-row gap-1">
        <IconButton isToolboxIcon={true} title={t('geometry_tool_form.move_points')}>
          <PointerIcon></PointerIcon>
        </IconButton>
        <IconButton isToolboxIcon={true} title={t('geometry_tool_form.add_points')}>
          <PencilPlusIcon></PencilPlusIcon>
        </IconButton>
        <IconButton isToolboxIcon={true} title={t('geometry_tool_form.delete_points')}>
          <EraserIcon></EraserIcon>
        </IconButton>
      </div>
    </div>
  );
}
