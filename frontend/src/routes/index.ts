import { Pages, Routes } from './types';
import { Debug } from '@/features/debugging/routes/Debug';
import { ImprintPage } from '@/features/imprint_page';
import { LandingPage } from '@/features/landing_page';
import { MapWrapper } from '@/features/map_planning';
import MapCreateForm from '@/features/maps/routes/MapCreateForm';
import MapEditForm from '@/features/maps/routes/MapEditForm';
import MapOverview from '@/features/maps/routes/MapOverview';
import { Chat } from '@/features/nextcloud_integration/components/chat';
import { Overview } from '@/features/overview/routes/Overview';
import { CreateSeed, ViewSeeds } from '@/features/seeds';
import { EditSeedPage } from '@/features/seeds/routes/EditSeed';

const routes: Routes = {
  [Pages.ImprintPage]: {
    component: ImprintPage,
    path: '/imprint',
    title: 'Imprint',
    restricted: false,
  },
  [Pages.CreateSeed]: {
    component: CreateSeed,
    path: '/seeds/create',
    title: 'New Seed Entry',
    restricted: true,
  },
  [Pages.ViewSeeds]: {
    component: ViewSeeds,
    path: '/seeds',
    title: 'My Seeds',
    restricted: true,
  },
  [Pages.EditSeed]: {
    component: EditSeedPage,
    path: '/seeds/:id/edit',
    title: 'Edit Seed',
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
  [Pages.Debug]: {
    component: Debug,
    path: '/debug',
    title: 'debug',
    restricted: false,
  },
  [Pages.Overview]: {
    component: Overview,
    path: '/overview',
    title: 'overview',
    restricted: false,
  },
  [Pages.Chat]: {
    component: Chat,
    path: '/chat',
    title: 'chat',
    restricted: false,
  },
};

export default routes;
