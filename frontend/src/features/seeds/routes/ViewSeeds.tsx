import useFindSeedsStore from '../store/FindSeedsStore';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const ViewSeeds = () => {
  const seeds = useFindSeedsStore((state) => state.seeds);

  useEffect(() => {
    const _findAllSeeds = async () => {
      await useFindSeedsStore.getState().findAllSeeds();
    };
    _findAllSeeds();
  }, []);

  return (
    <div>
      <h1>Seeds</h1>
      <ul>
        {seeds.map((seed) => (
          <li key={seed.id}>{seed.name}</li>
        ))}
      </ul>
      <div className="w-[200px]">
        <Link
          to="/seeds/new"
          className="text-blue-600 underline visited:text-blue-600 hover:text-blue-800"
        >
          Neuer Eintrag
        </Link>
      </div>
    </div>
  );
};
