import '../../../styles/geoMap.css';
import { GeoMap } from '../components/GeoMap';
import { Navbar } from '../components/Navbar';

export const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <div className="mb-8 flex flex-col items-center p-8">
        {/* <div className="max-w-3xl rounded bg-white p-4 border-b-4 mt-10"> */}
        {/*   <img src="/permaplant_drawing.jpeg" alt="Permaplant drawing" /> */}
        {/* </div> */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex w-1/2 items-end justify-end">
            <img src="/permaplant-logo-2.svg" alt="Permaplant drawing" />
          </div>
          <h1 className="w-1/2 max-w-md self-end text-4xl font-light">
            BE <span className="bg-yellow-500">GOOD</span> TO YOUR
            <span className="bg-emerald-500"> PLANTS</span>
          </h1>
        </div>
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <div className="flex flex-col md:w-1/3">
            <h5 className="border-l-2 pl-2 text-xl">Why?</h5>
            <ul className="ml-12 mt-4 flex max-w-xs flex-col items-center gap-8 rounded border-b-4 bg-white p-10 text-center">
              <li className="border-stone-400 pl-2 hover:border-l hover:font-bold">
                vital growth of delicious edible crops
              </li>
              <li className="border-stone-400 p-1 pl-2 hover:border hover:font-bold">
                providing a diverse and functioning ecosystem
              </li>
              <li className="border-stone-400 pl-2 pb-2 hover:border-b hover:font-bold">
                creating outdoor living spaces for both animals & humans
              </li>
            </ul>
          </div>
          <div className="mt-8 flex h-fit w-full max-w-3xl flex-col gap-4 p-8 md:w-2/3">
            <h5 className="mt-12 border-l-2 pl-2 text-xl">Reasons to join PermaPlanT</h5>
            <ul className="ml-12 mt-4 flex max-w-xs flex-col items-center gap-8 rounded border-b-4 bg-white p-10 text-center">
              <li className="border-stone-400 pl-2 pb-2 hover:border-l hover:font-bold">
                ecosystem suggestions{' '}
              </li>
              <li className="border-stone-400 pl-2 pb-2 hover:border-b hover:font-bold">
                practical for the gardener
              </li>
              <li className="border-stone-400 pl-2 pb-2 hover:border-b hover:font-bold">
                enhances diversity
              </li>
            </ul>
          </div>
        </div>
        <h2 className="mt-12 mb-4 border-l-2 pl-4">Who uses PermaPlanT</h2>
        <div className="mt-2 min-w-full grow grow rounded border-b-4 bg-white p-10">
          <GeoMap />
        </div>
        <a
          className="border-b border-stone-700"
          href="https://github.com/ElektraInitiative/PermaPlant/"
        >
          github
        </a>
      </div>
      {/* todo: image gallery */}
      <img src="https://nextcloud.markus-raab.org/nextcloud/index.php/apps/files_sharing/publicpreview/BLfGxHDZxrF4NKo?file=/logo_draft.png&fileId=466975&x=1080&y=1920&a=true" />
      <img src="https://nextcloud.markus-raab.org/nextcloud/index.php/apps/files_sharing/publicpreview/BLfGxHDZxrF4NKo?file=/20230204_Entwurf_Yvonne.jpeg&fileId=466982&x=1080&y=1920&a=true" />

    </div>
  );
};
