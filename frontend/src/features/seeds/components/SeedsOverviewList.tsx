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
        <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
          <thead className="bg-neutral-800 text-xs uppercase text-neutral-300">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Harvest Year
              </th>
            </tr>
          </thead>
          <tbody>
            {seeds.map((seed) => (
              <tr
                key={seed.id}
                className="cursor-pointer bg-primary-textfield hover:bg-neutral-700"
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
