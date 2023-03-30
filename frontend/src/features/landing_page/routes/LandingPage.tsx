import '../../../styles/geoMap.css';

import BlogOverview from '../components/BlogOverview';
import CTA from '../components/CTA';
import ContactUs from '../components/ContactUs';
import Features from '../components/Features';
import Footer from '../../../components/Layout/Footer';
import { Navbar2 } from '../../../components/Layout/Navbar';
import Pricing from '../components/Pricing';
import Team from '../components/Team';
import Testimonials from '../components/Testimonials';
import WidePageLayout from '@/components/Layout/WidePageLayout';

export const LandingPage = () => {
  return (
    <div className="h-full">
      <Navbar2 />
      <WidePageLayout>
        <div className="mb-8 flex flex-col items-center p-8">
          <div className="mt-10 flex flex-col items-center gap-4" id="home">
            <div className="flex w-1/2 items-end justify-end">
              <img src="/permaplant-logo-2.svg" alt="PermaplanT drawing" />
            </div>
          </div>
          <Features />
          <Testimonials />
          <Pricing />
          <CTA />
          <BlogOverview />
          <Team />
          <hr></hr>
          <ContactUs />
          {/*
          <h2 className="mt-12 mb-4 border-l-2 border-neutral-400 pl-4" id="map">
            The PermaplanT world
          </h2>
          <div className="mt-2 h-[25vh] min-h-[24rem] w-full min-w-[32rem] max-w-6xl grow rounded border-b-4 border-neutral-400 bg-neutral-100 p-10 dark:border-neutral-300-dark dark:bg-neutral-200-dark">
            <GeoMap />
            </div>*/}
        </div>

        {/*<section className="m-8" id="gallery">
          <h2 className="mt-12 ml-8 border-l-2 border-neutral-400 pl-4">Gallery</h2>
          <PhotoGallery />

        </section>*/}

        <Footer />
      </WidePageLayout>
    </div>
  );
};
