import PricingOption from '../components/PricingOption';
import SimpleButton from '@/components/Button/SimpleButton';
import PageTitle from '@/components/Header/PageTitle';
import Footer from '@/components/Layout/Footer';
import PageLayout from '@/components/Layout/PageLayout';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function PricingPage() {
  const { t } = useTranslation(['pricing']);

  const pricingOptions = t('pricing:options', { returnObjects: true });
  const [selectedOption, setSelectedOption] = useState(NaN);

  const options = pricingOptions.map((option, i) => {
    return (
      <PricingOption
        key={option.title}
        pricingOption={option}
        isSelected={selectedOption === i}
        index={i}
        onClickHandler={() => setSelectedOption(i)}
      />
    );
  });

  const selected = !isNaN(selectedOption);

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
