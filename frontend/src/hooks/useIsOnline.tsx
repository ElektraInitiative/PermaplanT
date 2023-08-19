import { useEffect, useRef, useState } from 'react';

export type UseIsOnlineArgs = {
  onOffline?: () => void;
  onOnline?: () => void;
};

export function useIsOnline({ onOffline, onOnline }: UseIsOnlineArgs = {}) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const onOnlineRef = useRef(onOnline);
  const onOfflineRef = useRef(onOffline);

  useEffect(() => {
    onOnlineRef.current = onOnline;
  }, [onOnline]);

  useEffect(() => {
    onOfflineRef.current = onOffline;
  }, [onOffline]);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      onOnlineRef.current?.();
    }

    function handleOffline() {
      setIsOnline(false);
      onOfflineRef.current?.();
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
