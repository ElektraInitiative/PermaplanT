import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { useTranslation } from 'react-i18next';

const ConditionalLoadingSpinner = ({ show }: { show: boolean }) => {
  return <div className="h-6 w-6">{show ? <LoadingSpinner /> : null}</div>;
};

/**
 * Attempts to log in the user with oidc
 *
 */
export const LoginButton = () => {
  const { t } = useTranslation(['auth']);
  const auth = useSafeAuth();

  if (auth.isAuthenticated) {
    return (
      <div>
        <SimpleButton className="pl-6 pr-0" onClick={() => void auth.removeUser()}>
          {t('auth:log_out')}
          <ConditionalLoadingSpinner show={auth.isLoading} />
        </SimpleButton>
      </div>
    );
  }

  return (
    <SimpleButton
      className="pl-6 pr-0"
      variant={ButtonVariant.primaryContainer}
      onClick={() => void auth.signinRedirect()}
    >
      {t('auth:log_in')}
      <ConditionalLoadingSpinner show={auth.isLoading} />
    </SimpleButton>
  );
};
