import { CreateSeed, ViewSeeds } from '@/features/seeds';
import { Pages, Routes } from './types';

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
