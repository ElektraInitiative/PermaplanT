import { Pages, Routes } from './types';

import { CreateSeed } from '@/features/seeds';

const routes: Routes = {
  [Pages.CreateSeed]: {
    component: CreateSeed,
    path: '/seeds/new',
    title: 'Neuer Eintrag',
  },
};

export default routes;
