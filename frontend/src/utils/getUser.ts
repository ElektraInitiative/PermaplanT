import { User } from 'oidc-client-ts';

export function getUser() {
  const authority = sessionStorage.getItem('authority');
  const client_id = sessionStorage.getItem('client_id');
  if (!authority || !client_id) {
    throw Error('invalid api config in session storage');
  }
  const oidcStorage = sessionStorage.getItem(`oidc.user:${authority}:${client_id}`);
  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage);
}
