import { useTranslation } from 'react-i18next';
import { Teammember } from './Teammember';

const Team = () => {
  const { t } = useTranslation(['team']);
  return (
    <section className="body-font">
      <div className="container mx-auto py-24">
        <div className="mb-20 flex w-full flex-col text-center">
          <h1 className="title-font mb-4 text-2xl font-medium sm:text-3xl">{t('team:header')}</h1>
          <p className="mx-auto text-base leading-relaxed xl:w-2/3">
            {t('team:subheader')}
          </p>
        </div>
        <div className="-m-2 flex flex-wrap">
          <Teammember
            name="Dr. Markus Raab"
            role="Project Lead"
            imageUri="/gallery_images/permaplant_illustration_12.svg"
          />
          <Teammember
            name="Yvonne Markl, MSc."
            role="Permaculture Expert"
            imageUri="/gallery_images/permaplant_illustration_12.svg"
          />
          <Teammember
            name="Samuel Daurer"
            role="Software Engineer"
            imageUri="/gallery_images/permaplant_illustration_12.svg"
          />
          <Teammember
            name="Gabriel Kitzberger"
            role="Software Engineer"
            imageUri="/gallery_images/permaplant_illustration_12.svg"
          />
          <Teammember
            name="Moritz Schalk"
            role="Software Engineer"
            imageUri="/gallery_images/permaplant_illustration_12.svg"
          />
          <Teammember
            name="Giancarlo Buenaflor"
            role="Software Engineer"
            imageUri="/gallery_images/permaplant_illustration_12.svg"
          />
          <Teammember
            name="Nursultan Imanov"
            role="Software Engineer"
            imageUri="/gallery_images/permaplant_illustration_12.svg"
          />
          <Teammember
            name="Lukas Hartl"
            role="DevOps"
            imageUri="/gallery_images/permaplant_illustration_12.svg"
          />
          <Teammember
            name="Ramzan Magomadow"
            role="Software Engineer"
            imageUri="/gallery_images/permaplant_illustration_12.svg"
          />
          <Teammember
            name="Thorben Staufer"
            role="Software Engineer"
            imageUri="/gallery_images/permaplant_illustration_12.svg"
          />
          <Teammember
            name="Benjamin Zinschitz"
            role="Software Engineer"
            imageUri="/gallery_images/permaplant_illustration_12.svg"
          />
          <Teammember
            name="Paul Buschmann"
            role="Software Engineer"
            imageUri="/gallery_images/permaplant_illustration_12.svg"
          />
          <Teammember
            name="Dr. Pavlo Ardanov"
            role="Permaculture Expert"
            imageUri="/gallery_images/permaplant_illustration_12.svg"
          />
        </div>
      </div>
    </section>
  );
};

export default Team;
