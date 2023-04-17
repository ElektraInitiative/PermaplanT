import PricingOption from '../components/PricingOption';
import SimpleButton from '@/components/Button/SimpleButton';
import PageTitle from '@/components/Header/PageTitle';
import Footer from '@/components/Layout/Footer';
import PageLayout from '@/components/Layout/PageLayout';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function PricingPage() {
  const { t } = useTranslation(['pricing']);
  const initialOptions = [
    {
      title: 'pricing:OptionA.title',
      info: 'pricing:OptionA.info',
      advantages: ['pricing:OptionA.advantages.one', 'pricing:OptionA.advantages.two'],
      isSelected: false,
    },
    {
      title: 'pricing:OptionB.title',
      info: 'pricing:OptionB.info',
      advantages: ['pricing:OptionB.advantages.one', 'pricing:OptionB.advantages.two'],
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
      <PageTitle title={t('pricing:title')} />
      <span className="text-center">{t('pricing:info')}</span>
      <div className="grid grid-cols-2 gap-8">{options}</div>
      <SimpleButton
        disabled={!selected}
        className={!selected ? 'opacity-50 hover:bg-primary-500 dark:hover:bg-primary-300' : ''}
      >
        {t('pricing:apply')}
      </SimpleButton>
      <Footer />
    </PageLayout>
  );
}
