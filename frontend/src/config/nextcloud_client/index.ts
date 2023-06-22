import { nextcloudUri } from '../env';
import { AuthType, createClient, WebDAVClient } from 'webdav';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { useEffect, useState } from 'react';

/**
 * create a webdav client configured for the PermaplanT Nextcloud instance
 * the configuration includes the baseUrl and authorization token if available
 */
export function useNextcloudWebDavClient() {
  const auth = useSafeAuth()
  const [webdav, setWebdav] = useState<WebDAVClient | null>(null)
  useEffect(() => {
    if(!auth || !auth.user){
      console.error("Could not create webdav client")
      return
    }
    console.log("create webdav client")
    setWebdav(createClient(nextcloudUri, {
      authType: AuthType.Token,
      token: {
        access_token: auth.user?.access_token,
        token_type: auth.user?.token_type,
        refresh_token: auth.user?.refresh_token,
      },
    }));
    console.log(webdav)
  }, [auth.user])
  return webdav
}
