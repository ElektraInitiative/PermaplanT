import { SeedDto } from '@/bindings/definitions';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface SeedsOverviewListProps {
  seeds: SeedDto[];
}

const SeedsOverviewList = ({ seeds }: SeedsOverviewListProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['seeds', 'common']);

  const handleSeedClick = (seed: SeedDto) => {
    navigate(`/seeds/${seed.id}`);
  };

  return (
    <Suspense>
      <section>
        <div className="relative overflow-x-auto rounded-lg">
          <table className="w-full bg-gray-200 text-left text-sm dark:bg-neutral-300-dark">
            <thead className="text-xs uppercase text-neutral-300">
              <tr>
                <th scope="col" className="px-6 py-3 dark:bg-neutral-200-dark">
                  {t('seeds:additional_name')}
                </th>
                <th scope="col" className="px-6 py-3 dark:bg-neutral-200-dark">
                  {t('seeds:quantity')}
                </th>
                <th scope="col" className="px-6 py-3 dark:bg-neutral-200-dark">
                  {t('seeds:harvest_year')}
                </th>
              </tr>
            </thead>
            <tbody>
              {seeds.map((seed) => (
                <tr
                  key={seed.id}
                  className="bg-primary-textfield cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-600"
                  onClick={() => {
                    handleSeedClick(seed);
                  }}
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-neutral-900 dark:text-white"
                  >
                    {seed.name}
                  </th>
                  <td className="px-6 py-4">{seed.quantity}</td>
                  <td className="px-6 py-4">{seed.harvest_year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Suspense>
  );
};

export default SeedsOverviewList;
