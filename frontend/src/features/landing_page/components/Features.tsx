import './Features.css';
import { ReactComponent as GlobeSVG } from '@/assets/globe.svg';
import { ReactComponent as PlanningSVG } from '@/assets/planning.svg';
import { ReactComponent as PlantSVG } from '@/assets/plant.svg';
import TypewriterComponent from 'typewriter-effect';

interface Feature {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: PlanningSVG,
    title: 'Garden Planning',
    description:
      'Plan your garden using our intuitive design tools. Choose from a variety of plants to create a beautiful garden space.',
  },
  {
    icon: PlantSVG,
    title: 'Why Permaculture',
    description:
      'The growth of edible crops is vital for creating a diverse and functioning ecosystem, while also providing outdoor living spaces for both animals and humans.',
  },
  {
    icon: GlobeSVG,
    title: 'Community',
    description:
      'Connect with other permaculture gardeners, share your successes and challenges, and get inspired by the beautiful gardens of others.',
  },
];

const Features = () => {
  return (
    <section>
      <div className="py-24">
        <div className="mb-20 text-center">
          <h1 className="title-font mx-auto mb-4 grid grid-cols-3 gap-2 text-2xl font-medium sm:text-3xl md:w-[500px]">
            <div className="col-span-2 text-right">
              make your <span className="text-primary-400 dark:text-primary-300">garden </span>
            </div>
            <div className="text-left">
              <TypewriterComponent
                onInit={(typewriter) => {
                  const strings = [' fruitful', ' colorful', ' practical', ' useful', ' abundant'];
                  strings.forEach((s) => {
                    typewriter.typeString(s).deleteAll();
                  });
                  typewriter.typeString(' diverse');
                  typewriter.start();
                }}
              />
            </div>
          </h1>
          <p className="mx-auto md:w-[500px]">
            Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub
            indxgo juice poutine, ramps microdosing banh mi pug.
          </p>
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
