import PricingOption from '../components/PricingOption';
import PageTitle from '@/components/Header/PageTitle';
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
    <PageLayout styleNames="flex flex-col space-y-4">
      <PageTitle title="Pricing" />
      <div className="grid grid-cols-2 gap-8">{options}</div>
    </PageLayout>
  );
}
