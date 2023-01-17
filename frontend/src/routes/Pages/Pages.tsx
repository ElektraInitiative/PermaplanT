import { Route, Routes } from 'react-router-dom';

import routes from '..';

function Pages() {
  return (
    <Routes>
      {Object.values(routes).map(({ path, component: Component }) => {
        return <Route key={path} path={path} element={<Component />} />;
      })}
    </Routes>
  );
}

export default Pages;
