import ButtonLink from '@/components/Button/ButtonLink';
import PageLayout from '@/components/Layout/PageLayout';
import { useSafeAuth } from '@/hooks/useSafeAuth';

export const Overview = () => {
  const auth = useSafeAuth();
  return (
    <PageLayout>
      {auth.isAuthenticated ? (
        <div className="flex flex-col">
          <ButtonLink title="Maps" to="/maps" />
          <ButtonLink title="Seeds" to="/seeds" />
        </div>
      ) : (
        <div>Please log in to access this page.</div>
      )}
    </PageLayout>
  );
};
