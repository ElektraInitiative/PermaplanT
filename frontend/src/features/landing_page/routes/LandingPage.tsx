import Footer from '../../../components/Layout/Footer';
import '../../../styles/geoMap.css';
import BlogOverview from '../components/BlogOverview';
import ContactUs from '../components/ContactUs';
import Features from '../components/Features';
import { GeoMap } from '../components/GeoMap';
import WidePageLayout from '@/components/Layout/WidePageLayout';

export const LandingPage = () => {
  return (
    <WidePageLayout>
      <div className="mb-8 flex flex-col items-center p-8">
        <img className="mt-10" id="home" src="/permaplant-logo-2.svg" alt="PermaplanT drawing" />
        <Features />
        <h2 className="mt-12 mb-4 border-l-2 border-neutral-400 pl-4" id="map">
          The PermaplanT world
        </h2>
        <div className="mt-2 h-[50vh] min-h-[24rem] w-full min-w-[32rem] max-w-6xl grow rounded bg-neutral-100 p-10 dark:border-neutral-300-dark dark:bg-neutral-200-dark">
          <GeoMap />
        </div>

        <BlogOverview />
        <ContactUs />
      </div>
      <Footer />
    </WidePageLayout>
  );
};
