import CountingButton from './CountingButton';
import { MapDto } from '@/api_types/definitions';
import IconButton from '@/components/Button/IconButton';
// import { ReactComponent as CopyIcon } from '@/svg/icons/copy.svg';
import { ReactComponent as EditIcon } from '@/svg/icons/edit.svg';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface MapCardProps {
  /** The map represented by this list item. */
  map: MapDto;
  /** The function called to duplicate this map. */
  onDuplicate: (target: MapDto) => void;
}

export default function MapCard({ map }: MapCardProps) {
  const { t } = useTranslation(['privacyOptions', 'maps']);
  const navigate = useNavigate();

  return (
    <div
      className="mb-4 flex rounded-lg bg-neutral-100 p-4 shadow-md hover:cursor-pointer dark:bg-neutral-800"
      title={map.name}
      onClick={() => navigate(`${map.id}`)}
    >
      {/* A preview image of the map can be placed here later */}
      <div id="placeholderImage" />
      <section className="flex flex-col">
        <span className="text-lg font-medium text-primary-500 dark:text-primary-300">
          {map.name}
        </span>
        <span className="text-sm italic">{map.creation_date}</span>
      </section>
      <span className="ml-1 text-sm">({t(`privacyOptions:${map.privacy}`)})</span>
      <section className="ml-auto flex items-center">
        <CountingButton iconType={0} count={map.honors} />
        <CountingButton iconType={1} count={map.visits} />
      </section>
      <section className="ml-4 flex flex-col justify-center">
        {/*
        <IconButton
          title={t('maps:overview.duplicate_title')}
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(map);
          }}
        >
          <CopyIcon className="h-5 w-5" />
        </IconButton>
        */}
        <IconButton
          title={t('maps:overview.edit_title')}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`${map.id}/edit`);
          }}
        >
          <EditIcon className="h-5 w-5" />
        </IconButton>
      </section>
    </div>
  );
}
