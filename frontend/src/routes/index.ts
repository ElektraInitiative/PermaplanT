import { Pages, Routes } from './types';

import { CreateSeed } from '@/features/seeds';
import { ViewSeeds } from '../features/seeds/routes/ViewSeeds';

const routes: Routes = {
  [Pages.CreateSeed]: {
    component: CreateSeed,
    path: '/seeds/new',
    title: 'Neuer Eintrag',
  },
  [Pages.ViewSeeds]: {
    component: ViewSeeds,
    path: '/seeds',
    title: 'Meine Saatgüter',
  },
};

export default routes;
