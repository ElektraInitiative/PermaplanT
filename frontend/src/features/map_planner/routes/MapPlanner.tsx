import { Toolbar } from '../components/Toolbar';

export const MapPlanner = () => {
  return (
    <div className="flex h-screen justify-between">
      <section className="grow">Planner section</section>
      <section className="h-full bg-neutral-300 dark:bg-neutral-200-dark">
        <Toolbar />
      </section>
    </div>
  );
};
