import { Pages, Routes } from './types';

import Page1 from '@/pages/NewSeed';
import Welcome from '@/pages/Welcome';

const routes: Routes = {
  [Pages.Welcome]: {
    component: Welcome,
    path: '/',
    title: 'Welcome',
  },
  [Pages.NewSeed]: {
    component: Page1,
    path: '/seeds/new',
    title: 'Neuer Eintrag',
  },
};

export default routes;
