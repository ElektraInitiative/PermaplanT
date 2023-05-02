import { NewMapDto } from '@/bindings/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import ModalContainer from '@/components/Modals/ModalContainer';
import TransparentBackground from '@/components/TransparentBackground';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface MapCreateModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  successCallback: (map: NewMapDto) => void;
}

export default function MapCreateModal({ show, setShow, successCallback }: MapCreateModalProps) {
  const { t } = useTranslation(['maps']);
  const [missingName, setMissingName] = useState(false);

  const missingNameText = (
    <p className="mb-2 block text-sm font-medium text-red-500">{t('maps:overview.missing_name')}</p>
  );

  async function onSubmit() {
    const mapNameInput = document.getElementById('mapNameInput') as HTMLInputElement;
    const mapName = mapNameInput ? mapNameInput.value : '';
    if (mapName === '') {
      setMissingName(true);
      return;
    }
    const newMap: NewMapDto = {
      name: mapName,
      creation_date: new Date().toISOString().split('T')[0],
      is_inactive: false,
      zoom_factor: 100,
      honors: 0,
      visits: 0,
      harvested: 0,
    };
    setShow(false);
    successCallback(newMap);
  }

  function onCancel() {
    setShow(false);
    setMissingName(false);
  }

  return (
    <>
      <TransparentBackground onClick={() => setShow(false)} show={show} />
      <ModalContainer show={show}>
        <div className="flex min-h-[200px] w-[400px] flex-col justify-between rounded-lg bg-neutral-100 p-6 dark:bg-neutral-100-dark">
          <h2>{t('maps:create.modal_title')}</h2>
          <input
            id="mapNameInput"
            onChange={() => setMissingName(false)}
            className="block h-11 w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300"
            style={{ colorScheme: 'dark' }}
            placeholder="Name"
          />
          {missingName && missingNameText}
          <div className="space-between flex flex-row justify-center space-x-8">
            <SimpleButton onClick={onCancel} className="max-w-[240px] grow">
              {t('maps:create.cancel_button')}
            </SimpleButton>
            <SimpleButton onClick={onSubmit} className="max-w-[240px] grow">
              {t('maps:create.submit_button')}
            </SimpleButton>
          </div>
        </div>
      </ModalContainer>
    </>
  );
}
