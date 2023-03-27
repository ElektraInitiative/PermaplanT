import '../../../styles/geoMap.css';
import { GeoMap } from '../components/GeoMap';
import { Navbar } from '../components/Navbar';
import { PhotoGallery } from '../components/PhotoGallery';

export const LandingPage = () => {
  return (
    <div className="h-full">
      <Navbar />
      <div className="mb-8 flex flex-col items-center p-8">
        <div className="mt-10 flex flex-col items-center gap-4" id="home">
          <div className="flex w-1/2 items-end justify-end">
            <img src="/permaplant-logo-2.svg" alt="PermaplanT drawing" />
          </div>
          <h1 className="w-1/2 max-w-md self-end text-4xl font-light">
            BE <span className="bg-yellow-500">GOOD</span> TO YOUR
            <span className="bg-emerald-500"> PLANTS</span>
          </h1>
        </div>
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <div className="flex flex-col md:w-1/3">
            <h5 className="border-l-2 pl-2 text-xl border-background-400">Why?</h5>
            <ul className="ml-12 mt-4 flex max-w-xs flex-col items-center gap-8 rounded border-b-4 border-background-300 bg-background-100 p-10 text-center dark:border-background-300-dark dark:bg-background-200-dark">
              <li className="m-[1px] border-background-400 pl-2 hover:ml-0 hover:border-l hover:font-bold">
                vital growth of delicious edible crops
              </li>
              <li className="m-[1px] border-background-400 p-1 pl-2 hover:m-0 hover:border hover:font-bold">
                providing a diverse and functioning ecosystem
              </li>
              <li className="m-[1px] border-background-400 pl-2 pb-2 hover:mb-0 hover:border-b hover:font-bold">
                creating outdoor living spaces for both animals & humans
              </li>
            </ul>
          </div>
          <div className="mt-8 flex h-fit w-full max-w-3xl flex-col gap-4 p-8 md:w-2/3">
            <h5 className="mt-12 border-l-2 pl-2 text-xl border-background-400">Reasons to join PermaplanT</h5>
            <ul className="ml-12 mt-4 flex max-w-xs flex-col items-center gap-8 rounded border-b-4 border-background-300 bg-background-100 p-10 text-center dark:border-background-300-dark dark:bg-background-200-dark">
              <li className="m-[1px] border-background-400 pl-2 pb-2 hover:ml-0 hover:border-l hover:font-bold">
                ecosystem suggestions
              </li>
              <li className="m-[1px] border-background-400 pl-2 pb-2 hover:mb-0 hover:border-b hover:font-bold">
                practical for the gardener
              </li>
              <li className="m-[1px] border-background-400 pl-2 pb-2 hover:mb-0 hover:border-b hover:font-bold">
                enhances diversity
              </li>
            </ul>
          </div>
        </div>
        <h2 className="mt-12 mb-4 border-l-2 pl-4 border-background-400" id="map">
          The PermaplanT world
        </h2>
        <div className="mt-2 h-[50vh] min-h-[24rem] w-full min-w-[32rem] max-w-6xl grow rounded border-b-4 border-background-400 bg-background-100 p-10 dark:border-background-300-dark dark:bg-background-200-dark">
          <GeoMap />
        </div>
      </div>
      {/* todo: image gallery */}
      {/* <img src="https://nextcloud.markus-raab.org/nextcloud/index.php/apps/files_sharing/publicpreview/BLfGxHDZxrF4NKo?file=/logo_draft.png&fileId=466975&x=1080&y=1920&a=true" /> */}
      {/* <img src="https://nextcloud.markus-raab.org/nextcloud/index.php/apps/files_sharing/publicpreview/BLfGxHDZxrF4NKo?file=/20230204_Entwurf_Yvonne.jpeg&fileId=466982&x=1080&y=1920&a=true" /> */}

      <section className="m-8" id="gallery">
        <h2 className="mt-12 ml-8 border-l-2 pl-4 border-background-400">Gallery</h2>
        <PhotoGallery />
      </section>
      <footer className="flex justify-center gap-4 p-4 px-8">
        <a
          className="border-b border-background-700"
          href="https://github.com/ElektraInitiative/Permaplant/"
        >
          github
        </a>
        <a className="border-b border-background-700" href="#home">
          home
        </a>
        <a className="border-b border-background-700" href="#gallery">
          gallery
        </a>
        <a className="border-b border-background-700" href="#map">
          map
        </a>
      </footer>
    </div>
  );
};
