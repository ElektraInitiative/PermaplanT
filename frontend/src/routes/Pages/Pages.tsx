import routes from '..';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { Route, Routes, Navigate } from 'react-router-dom';

function Pages() {
  const auth = useSafeAuth();

  return (
    <Routes>
      {Object.values(routes).map(({ path, component: Component, restricted }) => {
        if (restricted) {
          if (auth.isLoading) {
            return null;
          }
          return (
            <Route
              key={path}
              path={path}
              element={auth.isAuthenticated ? <Component /> : <Navigate to="/overview" />}
            />
          );
        }
        return <Route key={path} path={path} element={<Component />} />;
      })}
    </Routes>
  );
}

export default Pages;
