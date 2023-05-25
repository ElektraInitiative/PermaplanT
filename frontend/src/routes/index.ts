import { Pages, Routes } from './types';
import { ImprintPage } from '@/features/imprint_page';
import { LandingPage } from '@/features/landing_page';
import { MapWrapper } from '@/features/map_planning';
import MapCreateForm from '@/features/maps/routes/MapCreateForm';
import MapEditForm from '@/features/maps/routes/MapEditForm';
import MapOverview from '@/features/maps/routes/MapOverview';
import { WebdavTest } from '@/features/nextcloud_integration/components/webdav-test';
import { Overview } from '@/features/overview/routes/Overview';
import { CreateSeed, SeedDetails, ViewSeeds } from '@/features/seeds';
import { ChatTest } from '@/features/nextcloud_integration/components/chat-test';

const routes: Routes = {
  [Pages.ImprintPage]: {
    component: ImprintPage,
    path: '/imprint',
    title: 'Imprint',
    restricted: false,
  },
  [Pages.CreateSeed]: {
    component: CreateSeed,
    path: '/seeds/new',
    title: 'New Seed Entry',
    restricted: true,
  },
  [Pages.ViewSeeds]: {
    component: ViewSeeds,
    path: '/seeds',
    title: 'My Seeds',
    restricted: true,
  },
  [Pages.SeedDetails]: {
    component: SeedDetails,
    path: '/seeds/:id',
    title: 'Seed',
    restricted: true,
  },
  [Pages.LandingPage]: {
    component: LandingPage,
    path: '/',
    title: 'PermaplanT',
    restricted: false,
  },
  [Pages.Map]: {
    component: MapWrapper,
    path: '/maps/:mapId',
    title: 'Map',
    restricted: true,
  },
  [Pages.Maps]: {
    component: MapOverview,
    path: '/maps',
    title: 'Map Overview',
    restricted: true,
  },
  [Pages.MapCreation]: {
    component: MapCreateForm,
    path: '/maps/create',
    title: 'Map Creation',
    restricted: true,
  },
  [Pages.MapEdit]: {
    component: MapEditForm,
    path: '/maps/:mapId/edit',
    title: 'Edit Map',
    restricted: true,
  },
  [Pages.Webdav]: {
    component: WebdavTest,
    path: '/webdav',
    title: 'webdav',
    restricted: false,
  },
  [Pages.Overview]: {
    component: Overview,
    path: '/overview',
    title: 'overview',
    restricted: false,
  },
  [Pages.Chat]: {
    component: ChatTest,
    path: '/chat',
    title: 'chat',
  },
};

export default routes;
