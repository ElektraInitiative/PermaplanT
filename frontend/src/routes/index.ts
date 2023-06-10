import { Pages, Routes } from './types';
import { ImprintPage } from '@/features/imprint_page';
import { LandingPage } from '@/features/landing_page';
import { Map } from '@/features/map_planning';
import MapCreateForm from '@/features/maps/routes/MapCreateForm';
import MapOverview from '@/features/maps/routes/MapOverview';
import { WebdavTest } from '@/features/nextcloud_integration/components/webdav-test';
import { CreateSeed, SeedDetails, ViewSeeds } from '@/features/seeds';

const routes: Routes = {
  [Pages.ImprintPage]: {
    component: ImprintPage,
    path: '/imprint',
    title: 'Imprint',
  },
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
  [Pages.Map]: {
    component: Map,
    // path needs to change later to something like /user/:id/map/:id
    path: '/map',
    title: 'Map',
  },
  [Pages.Maps]: {
    component: MapOverview,
    // path needs to change later to something like /user/:id/maps
    path: '/maps',
    title: 'Map Overview',
  },
  [Pages.MapCreation]: {
    component: MapCreateForm,
    path: '/maps/create',
    title: 'Map Creation',
  },
  [Pages.Webdav]: {
    component: WebdavTest,
    // path needs to change later to something like /user/:id/maps
    path: '/webdav',
    title: 'webdav',
  },
};

export default routes;
