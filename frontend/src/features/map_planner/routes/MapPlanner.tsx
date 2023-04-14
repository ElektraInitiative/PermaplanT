import { Toolbar } from '../components/Toolbar';

export const MapPlanner = () => {
  return (
    <div className="flex h-full justify-between">
      <section className="grow">Planner section</section>
      <section className="min-h-full bg-neutral-100 dark:bg-neutral-200-dark">
        <Toolbar />
      </section>
    </div>
  );
};
