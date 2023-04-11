import { Pages, Routes } from './types';
import { LandingPage } from '@/features/landing_page';
import { CreateSeed, SeedDetails, ViewSeeds } from '@/features/seeds';

const routes: Routes = {
  [Pages.CreateSeed]: {
    component: CreateSeed,
    path: '/seeds/new',
    title: 'New Seed Entry',
  },
  [Pages.ViewSeeds]: {
    component: ViewSeeds,
    path: '/seeds',
    title: 'My Seeds',
  },
  [Pages.SeedDetails]: {
    component: SeedDetails,
    path: '/seeds/:id',
    title: 'Seed',
  },
  [Pages.LandingPage]: {
    component: LandingPage,
    path: '/',
    title: 'PermaplanT',
  },
};

export default routes;
