import SimpleButton from '@/components/Button/SimpleButton';
import { useAuth } from 'react-oidc-context';

export const LoginButton = () => {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return (
      <div>
        <SimpleButton onClick={() => void auth.removeUser()}>Log out</SimpleButton>
      </div>
    );
  }

  return <SimpleButton onClick={() => void auth.signinRedirect()}>Login</SimpleButton>;
};
