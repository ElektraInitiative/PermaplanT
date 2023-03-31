import '../../../styles/geoMap.css';

import BlogOverview from '../components/BlogOverview';
import CTA from '../components/CTA';
import ContactUs from '../components/ContactUs';
import Features from '../components/Features';
import Footer from '../../../components/Layout/Footer';
import Pricing from '../components/Pricing';
import Team from '../components/Team';
import Testimonials from '../components/Testimonials';
import WidePageLayout from '@/components/Layout/WidePageLayout';

export const LandingPage = () => {
  return (
    <WidePageLayout>
      <div className="mb-8 flex flex-col items-center p-8">
        <Features />
        <Testimonials />
        {/*
        map overlaps with navbar. playing around with zIndex didn't work so far
        <GeoMap />
         */}
        <Pricing />
        <CTA />
        <BlogOverview />
        <Team />
        <ContactUs />
      </div>
      <Footer />
    </WidePageLayout>
  );
};
