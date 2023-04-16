import Footer from '@/components/Layout/Footer';
import PageLayout from '@/components/Layout/PageLayout';
import ContactUs from '@/features/landing_page/components/ContactUs';
import { useTranslation } from 'react-i18next';

export function ImprintPage() {
  const { t } = useTranslation(['imprint']);

  return (
    <PageLayout styleNames="body-font relative w-full text-center">
      <h1 className="title-font mb-8 text-3xl font-medium text-primary-500 dark:text-primary-300 sm:text-4xl">
        {t('imprint:title')}
      </h1>
      <section
        id="general"
        className="mx-auto mb-24 flex flex-col text-base leading-relaxed lg:w-2/3"
      >
        <p>PermaplanT</p>
        <p>{t('imprint:chairman')}: Markus Raab</p>
        <p>
          {t('imprint:zvr_number')}: {t('imprint:zvr_placeholder')}
        </p>
        <p>
          {t('imprint:email')}: <a href="mailto://contact@permaplant.net">contact@permaplant.net</a>
        </p>
      </section>
      <section
        id="address"
        className="mx-auto mb-4 flex flex-col text-base leading-relaxed lg:w-2/3"
      >
        <b className="title-font text-1xl mb-4 font-medium sm:text-2xl">{t('imprint:address')}</b>
        <p>Feldgasse 19</p>
        <p>7321 Unterfrauenhaid</p>
        <p>{t('imprint:country')}</p>
      </section>
      <i className="mx-auto mb-4 flex flex-col text-base leading-relaxed lg:w-2/3">
        {t('imprint:legal_notice')}
      </i>
      <ContactUs />
      <Footer />
    </PageLayout>
  );
}
