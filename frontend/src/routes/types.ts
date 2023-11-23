import { FC } from 'react';
import { PathRouteProps } from 'react-router-dom';

enum Pages {
  ImprintPage,
  CreateSeed,
  ViewSeeds,
  EditSeed,
  LandingPage,
  Map,
  MapCreation,
  MapEdit,
  Maps,
  Overview,
  Chat,
  Debug,
}

type PathRouteCustomProps = {
  title?: string;
  component: FC;
  restricted: boolean;
};

type Routes = Record<Pages, PathRouteProps & PathRouteCustomProps>;

export { Pages };
export type { Routes };
