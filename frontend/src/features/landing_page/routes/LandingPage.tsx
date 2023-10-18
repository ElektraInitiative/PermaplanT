import Footer from '../../../components/Layout/Footer';
import '../../../styles/geoMap.css';
import BlogOverview from '../components/BlogOverview';
import Contact from '../components/Contact';
import Features from '../components/Features';
import { GeoMap } from '../components/GeoMap';
import { PhotoGallery } from '../components/PhotoGallery';
import Pricing from '../components/Pricing';
import Team from '../components/Team';
import HorizontalScrollingPicker from '@/components/HorizontalScrollingPicker';
import WidePageLayout from '@/components/Layout/WidePageLayout';
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
        <HorizontalScrollingPicker
          items={[
            '1930',
            '1931',
            '1932',
            '1933',
            '1934',
            '1935',
            '1936',
            '1937',
            '1938',
            '1939',
            '1940',
            '1941',
            '1942',
            '1943',
            '1944',
            '1945',
            '1946',
            '1947',
            '1948',
            '1949',
            '1950',
            '1951',
            '1952',
            '1953',
            '1954',
            '1955',
            '1956',
            '1957',
            '1958',
            '1959',
            '1960',
            '1961',
            '1962',
            '1963',
            '1964',
            '1965',
            '1966',
            '1967',
            '1968',
            '1969',
            '1970',
            '1971',
            '1972',
            '1973',
            '1974',
            '1975',
            '1976',
            '1977',
            '1978',
            '1979',
            '1980',
            '1981',
            '1982',
            '1983',
            '1984',
            '1985',
            '1986',
            '1987',
            '1988',
            '1989',
            '1990',
            '1991',
            '1992',
            '1993',
            '1994',
            '1995',
            '1996',
            '1997',
            '1998',
            '1999',
            '2000',
            '2001',
            '2002',
            '2003',
            '2004',
            '2005',
            '2006',
            '2007',
            '2008',
            '2009',
            '2010',
            '2011',
            '2012',
            '2013',
            '2014',
            '2015',
            '2016',
            '2017',
            '2018',
            '2019',
            '2020',
            '2021',
            '2022',
            '2023',
            '2024',
            '2025',
            '2026',
            '2027',
            '2028',
            '2029',
            '2030',
          ]}
          onChange={() => {
            console.log('changed');
          }}
        />
        <HorizontalScrollingPicker
          items={[
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
          ]}
          onChange={() => {
            console.log('changed');
          }}
        />
        <HorizontalScrollingPicker
          items={[
            '1',
            '2',
            '3',
            '4',
            '1',
            '2',
            '3',
            '4',
            '1',
            '2',
            '3',
            '4',
            '1',
            '2',
            '3',
            '4',
            '1',
            '2',
            '3',
            '4',
            '1',
            '2',
            '3',
            '4',
            '1',
            '2',
            '3',
            '4',
            '1',
            '2',
            '3',
            '4',
          ]}
          onChange={() => {
            console.log('changed');
          }}
        />
      </div>
      <Footer />
    </WidePageLayout>
  );
};
