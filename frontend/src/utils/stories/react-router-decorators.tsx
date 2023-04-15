import { ComponentType } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

/**
 * A decorator to wrap stories in a react-router MemoryRouter.
 * Use this decorator for components that use react-router.
 *
 * @param Story The story to wrap in a MemoryRouter
 * @returns The story wrapped in a MemoryRouter
 */
export const reactRouterDecorator = (Story: ComponentType) => {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/*" element={<Story />} />
      </Routes>
    </MemoryRouter>
  );
};
