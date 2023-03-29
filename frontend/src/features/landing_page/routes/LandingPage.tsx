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
            BE <span className="bg-primary-500">GOOD</span> TO YOUR
            <span className="bg-secondary-500"> PLANTS</span>
          </h1>
        </div>
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <div className="flex flex-col md:w-1/3">
            <h5 className="border-l-2 border-neutral-400 pl-2 text-xl">Why?</h5>
            <ul className="ml-12 mt-4 flex max-w-xs flex-col items-center gap-8 rounded border-b-4 border-neutral-300 bg-neutral-100 p-10 text-center dark:border-neutral-300-dark dark:bg-neutral-200-dark">
              <li className="m-[1px] border-neutral-400 pl-2 hover:ml-0 hover:border-l hover:font-bold">
                vital growth of delicious edible crops
              </li>
              <li className="m-[1px] border-neutral-400 p-1 pl-2 hover:m-0 hover:border hover:font-bold">
                providing a diverse and functioning ecosystem
              </li>
              <li className="m-[1px] border-neutral-400 pl-2 pb-2 hover:mb-0 hover:border-b hover:font-bold">
                creating outdoor living spaces for both animals & humans
              </li>
            </ul>
          </div>
          <div className="mt-8 flex h-fit w-full max-w-3xl flex-col gap-4 p-8 md:w-2/3">
            <h5 className="mt-12 border-l-2 border-neutral-400 pl-2 text-xl">
              Reasons to join PermaplanT
            </h5>
            <ul className="ml-12 mt-4 flex max-w-xs flex-col items-center gap-8 rounded border-b-4 border-neutral-300 bg-neutral-100 p-10 text-center dark:border-neutral-300-dark dark:bg-neutral-200-dark">
              <li className="m-[1px] border-neutral-400 pl-2 pb-2 hover:ml-0 hover:border-l hover:font-bold">
                ecosystem suggestions
              </li>
              <li className="m-[1px] border-neutral-400 pl-2 pb-2 hover:mb-0 hover:border-b hover:font-bold">
                practical for the gardener
              </li>
              <li className="m-[1px] border-neutral-400 pl-2 pb-2 hover:mb-0 hover:border-b hover:font-bold">
                enhances diversity
              </li>
            </ul>
          </div>
        </div>
        <h2 className="mt-12 mb-4 border-l-2 border-neutral-400 pl-4" id="map">
          The PermaplanT world
        </h2>
        <div className="mt-2 h-[50vh] min-h-[24rem] w-full min-w-[32rem] max-w-6xl grow rounded border-b-4 border-neutral-400 bg-neutral-100 p-10 dark:border-neutral-300-dark dark:bg-neutral-200-dark">
          <GeoMap />
        </div>
      </div>
      <section className="m-8" id="gallery">
        <h2 className="mt-12 ml-8 border-l-2 border-neutral-400 pl-4">Gallery</h2>
        <PhotoGallery />
      </section>
      <footer className="flex justify-center gap-4 p-4 px-8">
        <a
          className="border-b border-neutral-700"
          href="https://github.com/ElektraInitiative/Permaplant/"
        >
          github
        </a>
        <a className="border-b border-neutral-700" href="#home">
          home
        </a>
        <a className="border-b border-neutral-700" href="#gallery">
          gallery
        </a>
        <a className="border-b border-neutral-700" href="#map">
          map
        </a>
      </footer>
    </div>
  );
};
