import { FC } from 'react';
import { PathRouteProps } from 'react-router-dom';

enum Pages {
  ImprintPage,
  CreateSeed,
  ViewSeeds,
  SeedDetails,
  LandingPage,
  Map,
  Maps,
  Webdav
}

type PathRouteCustomProps = {
  title?: string;
  component: FC;
};

type Routes = Record<Pages, PathRouteProps & PathRouteCustomProps>;

export { Pages };
export type { Routes };
