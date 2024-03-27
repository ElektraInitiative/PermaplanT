import { Route, Routes, Navigate } from 'react-router-dom';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import routes from '..';

function Pages() {
  const auth = useSafeAuth();

  return (
    <Routes>
      {Object.values(routes).map(({ path, component: Component, restricted }) => {
        if (restricted) {
          if (auth.isLoading) {
            // return a route, else react router will print a warning
            return <Route key={path} path={path} element={null} />;
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
