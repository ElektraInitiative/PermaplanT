/**
 * sets up the auth properties in local storage
 */

const SessionStorageMock = {
  getItem: (key: string) => {
    if (key === 'authority') {
      return 'testing';
    }
    if (key === 'client_id') {
      return 'testing';
    }
    if (key === 'oidc.user:testing:testing') {
      return JSON.stringify({
        access_token: 'testing',
        expires_at: 1234567890,
        expires_in: 1234567890,
        id_token: 'testing',
        profile: 'testing',
      });
    }
    return null;
  },
};

vi.stubGlobal('sessionStorage', SessionStorageMock);
