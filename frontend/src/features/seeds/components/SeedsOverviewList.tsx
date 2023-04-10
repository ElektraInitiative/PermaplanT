import { SeedDto } from '@/bindings/definitions';
import { useNavigate } from 'react-router-dom';

interface SeedsOverviewListProps {
  seeds: SeedDto[];
}

const SeedsOverviewList = ({ seeds }: SeedsOverviewListProps) => {
  const navigate = useNavigate();

  const handleSeedClick = (seed: SeedDto) => {
    navigate(`/seeds/${seed.id}`);
  };

  return (
    <section className="">
      <div className="relative overflow-x-auto rounded-lg">
        <table className="w-full bg-gray-200 text-left text-sm dark:bg-neutral-300-dark">
          <thead className="text-xs uppercase text-neutral-300">
            <tr>
              <th scope="col" className="px-6 py-3 dark:bg-neutral-200-dark">
                Name
              </th>
              <th scope="col" className="px-6 py-3 dark:bg-neutral-200-dark">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3 dark:bg-neutral-200-dark">
                Harvest Year
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
  );
};

export default SeedsOverviewList;
