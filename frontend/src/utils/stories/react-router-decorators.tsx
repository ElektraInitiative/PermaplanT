import { ComponentType } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

export const reactRouterDecorator = (Story: ComponentType) => {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/*" element={<Story />} />
      </Routes>
    </MemoryRouter>
  );
};
