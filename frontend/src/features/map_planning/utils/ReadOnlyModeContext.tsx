import { errorToastGrouped } from '@/features/toasts/groupedToast';
import { useIsOnline } from '@/hooks/useIsOnline';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const ReadOnlyModeContext = React.createContext(false);

type ReadOnlyContextProps = {
  children: React.ReactNode;
};

export function ReadOnlyModeContextProvider({ ...props }: ReadOnlyContextProps) {
  const [t] = useTranslation(['readOnly']);

  const isOnline = useIsOnline({
    onOffline: () => {
      errorToastGrouped(t('readOnly:activated'), {
        toastId: 'offline',
        autoClose: false,
      });
    },
    onOnline: () => {
      toast.dismiss('offline');
    },
  });

  const isOffline = !isOnline;

  return <ReadOnlyModeContext.Provider value={isOffline} {...props} />;
}

export function useIsReadOnlyMode() {
  const context = React.useContext(ReadOnlyModeContext);
  if (context === undefined) {
    throw new Error(`useIsReadOnlyMode must be used within a ReadOnlyModeContextProvider`);
  }
  return context;
}
