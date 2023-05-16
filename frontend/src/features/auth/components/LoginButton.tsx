import SimpleButton from '@/components/Button/SimpleButton';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { useAuth } from 'react-oidc-context';

const ConditionalLoadingSpinner = ({ show }: { show: boolean }) => {
  return <div className="h-6 w-6">{show ? <LoadingSpinner /> : null}</div>;
};

export const LoginButton = () => {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return (
      <div>
        <SimpleButton className="pl-6 pr-0" onClick={() => void auth.removeUser()}>
          Log out
          <ConditionalLoadingSpinner show={auth.isLoading} />
        </SimpleButton>
      </div>
    );
  }

  return (
    <SimpleButton className="pl-6 pr-0" onClick={() => void auth.signinRedirect()}>
      Login
      <ConditionalLoadingSpinner show={auth.isLoading} />
    </SimpleButton>
  );
};
