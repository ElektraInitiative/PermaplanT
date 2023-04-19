import { Teammember } from './Teammember';
import { useTranslation } from 'react-i18next';

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
            imageUri="https://cloud.permaplant.net/nextcloud/index.php/s/2arzyJZYj2oNnHX/download?path=%2FAvatars&files=Markus_Raab.jpg"
          />
          <Teammember
            name="Yvonne Markl, MSc."
            role="Project Lead, Permaculture Expert"
            imageUri="https://cloud.permaplant.net/nextcloud/index.php/s/Zg3qpiECGdLYLfc/download/Yvonne_Markl.jpg"
          />
          <Teammember
            name="Samuel Daurer"
            role="Software Engineer"
            imageUri="https://cloud.permaplant.net/nextcloud/index.php/s/EbkxrCDLrHdeNFm/download/Samuel_Daurer_profile.jpg"
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
            imageUri="https://cloud.permaplant.net/nextcloud/index.php/s/3s8jxENdt5Mz543/download/Ramzan_Magomadow.jpg"
          />
          <Teammember
            name="Thorben Staufer"
            role="Software Engineer"
            imageUri="https://cloud.permaplant.net/nextcloud/index.php/s/eLNAYdKw73Kn6df/download/Thorben_Staufer.jpg"
          />
          <Teammember
            name="Benjamin Zinschitz"
            role="Software Engineer"
            imageUri="https://cloud.permaplant.net/nextcloud/index.php/s/BTQBYPbaSFsrt3f/download/Benjamin_Zinschitz.jpg"
          />
          <Teammember
            name="Paul Buschmann"
            role="Software Engineer"
            imageUri="https://cloud.permaplant.net/nextcloud/index.php/s/azpBktirRTNmtaN/download/Paul_Buschmann.jpg"
          />
          <Teammember
            name="Dr. Pavlo Ardanov"
            role="Permaculture Expert"
            imageUri="https://cloud.permaplant.net/nextcloud/index.php/s/SdzHJyAsRDQGyaW/download/Pavlo_Ardanov.jpg"
          />
        </div>
      </div>
    </section>
  );
};

export default Team;
