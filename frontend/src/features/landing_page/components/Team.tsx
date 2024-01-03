import { useTranslation } from 'react-i18next';
import { Teammember } from './Teammember';

const Team = () => {
  const { t } = useTranslation(['team']);
  return (
    <section className="body-font">
      <div className="container mx-auto py-24">
        <div className="mb-20 flex w-full flex-col text-center">
          <h1 className="title-font mb-4 text-2xl font-medium sm:text-3xl">{t('team:header')}</h1>
          <p className="mx-auto text-base leading-relaxed xl:w-2/3">{t('team:subheader')}</p>
        </div>
        <div className="-m-2 flex flex-wrap">
          <Teammember
            name="Dr. Markus Raab"
            role="Project Lead, Software Engineer"
            path="/Avatars/Markus_Raab.jpg"
          />
          <Teammember
            name="Yvonne Markl, MSc."
            role="Project Lead, Permaculture Expert"
            path="/Avatars/Yvonne_Markl.jpg"
          />
          <Teammember
            name="Samuel Daurer"
            role="Software Engineer"
            path="/Avatars/Samuel_Daurer_profile.jpg"
          />
          <Teammember
            name="Gabriel Kitzberger"
            role="Software Engineer"
            path="/Avatars/Gabriel_Kitzberger.jpg"
          />
          <Teammember
            name="Moritz Schalk"
            role="Software Engineer"
            path="/Avatars/person_placeholder.png"
          />
          <Teammember
            name="Giancarlo Buenaflor"
            role="Software Engineer"
            path="/Avatars/person_placeholder.png"
          />
          <Teammember
            name="Nursultan Imanov"
            role="Software Engineer"
            path="/Avatars/person_placeholder.png"
          />
          <Teammember name="Lukas Hartl" role="DevOps" path="/Avatars/person_placeholder.png" />
          <Teammember
            name="Aydan Namdar Ghazani"
            role="DevOps"
            path="/Avatars/person_placeholder.png"
          />
          <Teammember
            name="Ramzan Magomadow"
            role="Software Engineer"
            path="/Avatars/Ramzan_Magomadow.jpg"
          />
          <Teammember
            name="Thorben Staufer"
            role="Software Engineer"
            path="/Avatars/Thorben_Staufer.jpg"
          />
          <Teammember
            name="Benjamin Zinschitz"
            role="Software Engineer"
            path="/Avatars/Benjamin_Zinschitz.jpg"
          />
          <Teammember
            name="Paul Buschmann"
            role="Software Engineer"
            path="/Avatars/Paul_Buschmann.jpg"
          />
          <Teammember
            name="Christoph Kraus"
            role="Security Analyst"
            path="/Avatars/person_placeholder.png"
          />
          <Teammember
            name="Christoph Nemeth"
            role="Software Engineer"
            path="/Avatars/person_placeholder.png"
          />
          <Teammember
            name="Dr. Pavlo Ardanov"
            role="Permaculture Expert"
            path="/Avatars/Pavlo_Ardanov.jpg"
          />
        </div>
      </div>
    </section>
  );
};

export default Team;
