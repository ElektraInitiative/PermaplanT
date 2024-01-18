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
            name="Yvonne Markl, MSc."
            role={`${t('team:role_lead', { context: 'female' })}, ${t(
              'team:role_permaculture_expert',
              { context: 'female' },
            )}`}
            path="/Avatars/Yvonne_Markl.jpg"
          />
          <Teammember
            name="Dr. Markus Raab"
            role={`${t('team:role_lead', { context: 'male' })}, ${t('team:role_software_engineer', {
              context: 'male',
            })}`}
            path="/Avatars/Markus_Raab.jpg"
          />
          <Teammember
            name="Paul Buschmann"
            role={t('team:role_software_engineer', { context: 'male' })}
            path="/Avatars/Paul_Buschmann.jpg"
          />
          <Teammember
            name="Christoph Schreiner"
            role={t('team:role_software_engineer', { context: 'male' })}
            path="/Avatars/person_placeholder.png"
          />
          <Teammember
            name="Daniel Steinkogler"
            role={t('team:role_software_engineer', { context: 'male' })}
            path="/Avatars/person_placeholder.png"
          />
          <Teammember
            name="Jannis Adamek"
            role={t('team:role_software_engineer', { context: 'male' })}
            path="/Avatars/person_placeholder.png"
          />
          <Teammember
            name="Moritz Schalk"
            role={t('team:role_software_engineer', { context: 'male' })}
            path="/Avatars/person_placeholder.png"
          />
          <Teammember
            name="Samuel Daurer"
            role={t('team:role_software_engineer', { context: 'male' })}
            path="/Avatars/Samuel_Daurer_profile.jpg"
          />
          <Teammember
            name="Gabriel Kitzberger"
            role={t('team:role_software_engineer', { context: 'male' })}
            path="/Avatars/Gabriel_Kitzberger.jpg"
          />
          <Teammember
            name="Giancarlo Buenaflor"
            role={t('team:role_software_engineer', { context: 'male' })}
            path="/Avatars/person_placeholder.png"
          />
          <Teammember
            name="Nursultan Imanov"
            role={t('team:role_software_engineer', { context: 'male' })}
            path="/Avatars/person_placeholder.png"
          />
          <Teammember
            name="Lukas Hartl"
            role={t('team:role_devops', { context: 'male' })}
            path="/Avatars/person_placeholder.png"
          />
          <Teammember
            name="Aydan Namdar Ghazani"
            role={t('team:role_devops', { context: 'male' })}
            path="/Avatars/person_placeholder.png"
          />
          <Teammember
            name="Ramzan Magomadow"
            role={t('team:role_software_engineer', { context: 'male' })}
            path="/Avatars/Ramzan_Magomadow.jpg"
          />
          <Teammember
            name="Thorben Staufer"
            role={t('team:role_software_engineer', { context: 'male' })}
            path="/Avatars/Thorben_Staufer.jpg"
          />
          <Teammember
            name="Benjamin Zinschitz"
            role={t('team:role_software_engineer', { context: 'male' })}
            path="/Avatars/Benjamin_Zinschitz.jpg"
          />
          <Teammember
            name="Christoph Kraus"
            role={t('team:role_security_analyst', { context: 'male' })}
            path="/Avatars/person_placeholder.png"
          />
          <Teammember
            name="Christoph Nemeth"
            role={t('team:role_software_engineer', { context: 'male' })}
            path="/Avatars/person_placeholder.png"
          />
          <Teammember
            name="Dr. Pavlo Ardanov"
            role={t('team:role_permaculture_expert', { context: 'male' })}
            path="/Avatars/Pavlo_Ardanov.jpg"
          />
          <Teammember
            name="Dr. Christoph Höfer"
            role={t('team:role_permaculture_expert', { context: 'male' })}
            path="/Avatars/person_placeholder.png"
          />
        </div>
      </div>
    </section>
  );
};

export default Team;
