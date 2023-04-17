import PricingOption from '../components/PricingOption';
import SimpleButton from '@/components/Button/SimpleButton';
import PageTitle from '@/components/Header/PageTitle';
import Footer from '@/components/Layout/Footer';
import PageLayout from '@/components/Layout/PageLayout';
import { useState } from 'react';

export default function PricingPage() {
  const initialOptions = [
    {
      title: 'Option A',
      info: 'The first option.',
      advantages: ['Is an option.', 'Would recommend'],
      isSelected: false,
    },
    {
      title: 'Option B',
      info: 'The second option.',
      advantages: ['Also an option.', 'Maybe better.'],
      isSelected: false,
    },
  ];
  const [pricingOptions, setPricingOptions] = useState(initialOptions);
  const selected = pricingOptions.find((option) => option.isSelected) !== undefined;

  const options = pricingOptions.map((option) => {
    return <PricingOption key={option.title} {...option} onClickHandler={selectPricingOption} />;
  });

  function selectPricingOption(id: string) {
    setPricingOptions(
      pricingOptions.map((option) => {
        if (option.title === id) {
          return { ...option, isSelected: true };
        } else {
          return { ...option, isSelected: false };
        }
      }),
    );
  }

  return (
    <PageLayout styleNames="flex flex-col gap-12 space-y-4">
      <PageTitle title="Pricing" />
      <span className="text-center">This text tells you a little about our pricing strategy!</span>
      <div className="grid grid-cols-2 gap-8">{options}</div>
      <SimpleButton
        disabled={!selected}
        className={!selected ? 'opacity-50 hover:bg-primary-500 dark:hover:bg-primary-300' : ''}
      >
        Apply Now!
      </SimpleButton>
      <Footer />
    </PageLayout>
  );
}
