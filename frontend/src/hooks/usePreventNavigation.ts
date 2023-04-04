import { useEffect } from 'react';

function usePreventNavigation(shouldPrevent: boolean) {
  useEffect(() => {
    if (!shouldPrevent) return;

    function preventNavigation(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = '';
    }

    window.addEventListener('beforeunload', preventNavigation);

    return () => window.removeEventListener('beforeunload', preventNavigation);
  }, [shouldPrevent]);
}

export default usePreventNavigation;
