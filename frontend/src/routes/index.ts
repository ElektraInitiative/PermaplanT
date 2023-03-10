import { Pages, Routes } from './types';
import { ViewDemo } from '@/features/demo';
import { CreateSeed, ViewSeeds } from '@/features/seeds';

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
  [Pages.ViewDemo]: {
    component: ViewDemo,
    path: '/demo',
    title: 'Demo',
  },
};

export default routes;
