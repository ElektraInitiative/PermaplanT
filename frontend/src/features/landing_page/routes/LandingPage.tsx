import Footer from '../../../components/Layout/Footer';
import '../../../styles/geoMap.css';
import BlogOverview from '../components/BlogOverview';
import Contact from '../components/Contact';
import Features from '../components/Features';
import { GeoMap } from '../components/GeoMap';
import { PhotoGallery } from '../components/PhotoGallery';
import Pricing from '../components/Pricing';
import Team from '../components/Team';
import WidePageLayout from '@/components/Layout/WidePageLayout';
import TimelineDatePicker from '@/components/TImePicker/TimelineDatePicker';
import { useTranslation } from 'react-i18next';

export const LandingPage = () => {
  const { t } = useTranslation(['landingPage']);
  return (
    <WidePageLayout>
      <div className="mb-8 flex flex-col items-center p-8">
        <img
          className="mt-10"
          id="home"
          src="/permaplant-logo-2-colors.svg"
          alt="PermaplanT drawing"
        />
        <Features />
        <h2 className="mb-4 mt-12 border-l-2 border-neutral-400 pl-4" id="map">
          {t('landingPage:title')}
        </h2>
        <div className="mt-2 h-[50vh] min-h-[24rem] w-full max-w-6xl grow rounded bg-neutral-100 p-4 dark:border-neutral-300-dark dark:bg-neutral-200-dark md:min-w-[32rem] md:p-10">
          <GeoMap />
        </div>
        <Team />
        <BlogOverview />
        <PhotoGallery />
        <Pricing />
        <Contact />
        <TimelineDatePicker />
      </div>
      <Footer />
    </WidePageLayout>
  );
};
