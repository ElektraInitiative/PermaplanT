import { Pages, Routes } from './types';

import Page1 from '@/pages/Page1';
import Welcome from '@/pages/Welcome';

const routes: Routes = {
  [Pages.Welcome]: {
    component: Welcome,
    path: '/',
    title: 'Welcome',
  },
  [Pages.Page1]: {
    component: Page1,
    path: '/page-1',
    title: 'Page 1',
  },
};

export default routes;
