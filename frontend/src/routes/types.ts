import { FC } from 'react';
import { PathRouteProps } from 'react-router-dom';

enum Pages {
  ImprintPage,
  CreateSeed,
  ViewSeeds,
  EditSeed,
  SeedDetails,
  LandingPage,
  Map,
  MapCreation,
  MapEdit,
  Maps,
  Webdav,
  Overview,
}

type PathRouteCustomProps = {
  title?: string;
  component: FC;
  restricted: boolean;
};

type Routes = Record<Pages, PathRouteProps & PathRouteCustomProps>;

export { Pages };
export type { Routes };
