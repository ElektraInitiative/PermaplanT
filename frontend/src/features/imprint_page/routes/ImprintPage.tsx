import Footer from "@/components/Layout/Footer";
import PageLayout from "@/components/Layout/PageLayout";
import ContactUs from "@/features/landing_page/components/ContactUs";

export function ImprintPage() {

    return (
        <PageLayout styleNames="body-font relative w-full text-center">
            <h1 className="title-font mb-8 text-3xl font-medium sm:text-4xl text-primary-500 dark:text-primary-300">Imprint</h1>
            <section id="general" className="mb-4 flex flex-col mx-auto text-base leading-relaxed lg:w-2/3">
                <p>PermaplanT</p>
                <p>Chairman: Markus Raab</p>
                <p>ZVR Nr.: not yet registered</p>
                <p>E-Mail: <a href="mailto://contact@permaplant.net">contact@permaplant.net</a></p>
            </section>
            <section id="address" className="mb-4 flex flex-col mx-auto text-base leading-relaxed lg:w-2/3">
                <b className="title-font mb-4 text-1xl font-medium sm:text-2xl">Address</b>
                <p>Feldgasse 19</p>
                <p>7321 Unterfrauenhaid</p>
                <p>Austria</p>
            </section>
            <i className="mb-4 flex flex-col mx-auto text-base leading-relaxed lg:w-2/3">
                This website is purely non-commercial, this website does not sell anything. It only offers you various forms of memberships.
            </i>
            <ContactUs />
            <Footer />
        </PageLayout>
    );
}