import { DefaultLanguage } from '@/config/i18n';

interface PricingOptionProps {
  /** the translated strings of the pricing option. */
  pricingOption: DefaultLanguage['pricing']['options'][number];
  /** a flag indicating whether this option was selected. */
  isSelected: boolean;
  /** the index to determine the selection. */
  index: number;
  /** the event handler for the click action. */
  onClickHandler(id: string): void;
}

/**
 * A card-like container detailing one specific pricing option.
 */
export default function PricingOption({
  pricingOption,
  isSelected,
  onClickHandler,
}: PricingOptionProps) {
  const listContent = pricingOption.advantages.map((a) => {
    return <li key={a}>{a}</li>;
  });
  const containerStyle =
    'text-center shadow-lg rounded-lg p-6 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer';
  const selectedStyle = ' outline outline-primary-500 dark:outline-primary-300';

  return (
    <div
      id={pricingOption.title}
      className={isSelected ? containerStyle + selectedStyle : containerStyle}
      onClick={(e) => onClickHandler(e.currentTarget.id)}
    >
      <h2 className="mb-2">{pricingOption.title}</h2>
      <p className="mb-4">{pricingOption.info}</p>
      <hr className="mb-4 h-px border-0 bg-primary-500 dark:bg-primary-300" />
      <ul className="ml-5 list-disc text-left">{listContent}</ul>
    </div>
  );
}
