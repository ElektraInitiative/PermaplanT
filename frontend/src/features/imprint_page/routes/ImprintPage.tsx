import Footer from '@/components/Layout/Footer';
import PageLayout from '@/components/Layout/PageLayout';
import ContactUs from '@/features/landing_page/components/ContactUs';

export function ImprintPage() {
  return (
    <PageLayout styleNames="body-font relative w-full text-center">
      <h1 className="title-font mb-8 text-3xl font-medium text-primary-500 dark:text-primary-300 sm:text-4xl">
        Imprint
      </h1>
      <section
        id="general"
        className="mx-auto mb-4 flex flex-col text-base leading-relaxed lg:w-2/3"
      >
        <p>PermaplanT</p>
        <p>Chairman: Markus Raab</p>
        <p>ZVR Nr.: not yet registered</p>
        <p>
          E-Mail: <a href="mailto://contact@permaplant.net">contact@permaplant.net</a>
        </p>
      </section>
      <section
        id="address"
        className="mx-auto mb-4 flex flex-col text-base leading-relaxed lg:w-2/3"
      >
        <b className="title-font text-1xl mb-4 font-medium sm:text-2xl">Address</b>
        <p>Feldgasse 19</p>
        <p>7321 Unterfrauenhaid</p>
        <p>Austria</p>
      </section>
      <i className="mx-auto mb-4 flex flex-col text-base leading-relaxed lg:w-2/3">
        This website is purely non-commercial, this website does not sell anything. It only offers
        you various forms of memberships.
      </i>
      <ContactUs />
      <Footer />
    </PageLayout>
  );
}
