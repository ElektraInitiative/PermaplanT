import { ReactComponent as GlobeSVG } from '../../../../public/globe.svg';
import { ReactComponent as PlanningSVG } from '../../../../public/planning.svg';
import './Features.css';
import { ReactComponent as PlantSVG } from '@public/plant.svg';
import { useTranslation } from 'react-i18next';
import TypewriterComponent from 'typewriter-effect';

interface Feature {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const Features = () => {
  const { t, i18n } = useTranslation(['featureDescriptions']);
  const features: Feature[] = [
    {
      icon: PlanningSVG,
      title: t('featureDescriptions:garden_planning.title'),
      description: t('featureDescriptions:garden_planning.description'),
    },
    {
      icon: PlantSVG,
      title: t('featureDescriptions:why.title'),
      description: t('featureDescriptions:why.description'),
    },
    {
      icon: GlobeSVG,
      title: t('featureDescriptions:community.title'),
      description: t('featureDescriptions:community.description'),
    },
  ];
  return (
    <section>
      <div className="py-24">
        <div className="mb-20 text-center">
          <h1 className="title-font mx-auto mb-4 grid grid-cols-3 gap-2 text-2xl font-medium sm:text-3xl md:w-[500px]">
            <div className="col-span-2 text-right">
              {t('featureDescriptions:slogan.first_part')}{' '}
              <span className="text-primary-400 dark:text-primary-300">
                {t('featureDescriptions:slogan.second_part')}{' '}
              </span>
            </div>
            <div className="text-left">
              <TypewriterComponent
                // remount the component when language changes, so that the typewriter effect is reset
                key={i18n.resolvedLanguage}
                onInit={(typewriter) => {
                  const strings = t('featureDescriptions:slogan.third_part', {
                    returnObjects: true,
                  });

                  strings.forEach((s) => {
                    typewriter.typeString(s).deleteAll();
                  });
                  typewriter.typeString(t('featureDescriptions:slogan.last_word'));
                  typewriter.start();
                }}
              />
            </div>
          </h1>
          <p className="mx-auto md:w-[500px]"></p>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-16 rounded-full bg-secondary-500 dark:bg-secondary-300"></div>
          </div>
        </div>
        <div className="-mx-4 -mb-10 -mt-4 flex flex-wrap space-y-6 sm:-m-4 md:space-y-0">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center p-4 text-center md:w-1/3"
            >
              <div className="mb-5 inline-flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary-400 dark:bg-primary-300">
                {<feature.icon className="h-8 w-8" />}
              </div>
              <div className="flex-grow">
                <h2 className="title-font mb-3 text-lg font-medium">{feature.title}</h2>
                <p className="text-base leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
