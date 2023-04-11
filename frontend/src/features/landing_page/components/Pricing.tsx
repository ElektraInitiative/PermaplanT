import { useState } from 'react';

const Pricing = () => {
  const [selected, setSelected] = useState(NaN);

  return (
    <section className="body-font text-neutral-600">
      <div className="mx-auto py-24">
        <div className="mb-20 flex w-full flex-col text-center">
          <h1 className="title-font mb-12 text-center text-3xl font-medium">Pricing</h1>
          <p className="mx-auto text-base leading-relaxed">
            Banh mi cornhole echo park skateboard authentic crucifix neutra tilde lyft biodiesel
            artisan direct trade mumblecore 3 wolf moon twee Banh mi cornhole echo park skateboard
            authentic crucifix neutra tilde lyft biodiesel
          </p>
        </div>
        <div className="mx-auto w-full overflow-auto">
          <table className="whitespace-no-wrap w-full table-auto rounded text-left dark:bg-neutral-300-dark">
            <thead>
              <tr>
                <th className="title-font rounded-tl rounded-bl bg-neutral-100 px-4 py-3 text-sm font-medium tracking-wider dark:bg-neutral-200-dark">
                  Plan
                </th>
                <th className="title-font bg-neutral-100 px-4 py-3 text-sm font-medium tracking-wider dark:bg-neutral-200-dark">
                  Speed
                </th>
                <th className="title-font bg-neutral-100 px-4 py-3 text-sm font-medium tracking-wider dark:bg-neutral-200-dark">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={
                  'cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-400-dark' +
                  (selected == 0 ? ' bg-primary-400' : '')
                }
                onClick={() => setSelected(0)}
              >
                <td className="px-4 py-3">Start</td>
                <td className="px-4 py-3">5 Mb/s</td>
                <td className="px-4 py-3 text-lg">Free</td>
              </tr>
              <tr
                className={
                  'cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-400-dark' +
                  (selected == 1 ? ' bg-primary-400' : '')
                }
                onClick={() => setSelected(1)}
              >
                <td className="border-t-2 border-neutral-100 px-4 py-3 dark:border-neutral-400-dark">
                  Pro
                </td>
                <td className="border-t-2 border-neutral-100 px-4 py-3 dark:border-neutral-400-dark">
                  25 Mb/s
                </td>
                <td className="border-t-2 border-neutral-100 px-4 py-3 text-lg dark:border-neutral-400-dark ">
                  $24
                </td>
              </tr>
              <tr
                className={
                  'cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-400-dark' +
                  (selected == 2 ? ' bg-primary-400' : '')
                }
                onClick={() => setSelected(2)}
              >
                <td className="border-t-2 border-neutral-100 py-3 px-4 dark:border-neutral-400-dark ">
                  Business
                </td>
                <td className="border-t-2 border-neutral-100 px-4 py-3 dark:border-neutral-400-dark">
                  36 Mb/s
                </td>
                <td className="border-t-2 border-neutral-100 px-4 py-3 text-lg dark:border-neutral-400-dark">
                  $50
                </td>
              </tr>
              <tr
                className={
                  'cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-400-dark' +
                  (selected == 3 ? ' bg-primary-400' : '')
                }
                onClick={() => setSelected(3)}
              >
                <td className="border-t-2 border-b-2 border-neutral-100 px-4 py-3 dark:border-neutral-400-dark">
                  Exclusive
                </td>
                <td className="border-t-2 border-b-2 border-neutral-100 px-4 py-3 dark:border-neutral-400-dark">
                  48 Mb/s
                </td>
                <td className="border-t-2 border-b-2 border-neutral-100 px-4 py-3 text-lg dark:border-neutral-400-dark">
                  $72
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mx-auto mt-4 flex w-full pl-4 lg:w-2/3">
          <a className="inline-flex items-center text-secondary-500 dark:text-secondary-300 md:mb-2 lg:mb-0">
            Learn More
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="ml-2 h-4 w-4"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
          <button className="ml-auto flex rounded border-0 bg-primary-500 py-2 px-6 text-primary-50 hover:bg-primary-600 focus:outline-none dark:bg-primary-300 dark:text-primary-700 dark:hover:bg-primary-200">
            Button
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
