interface PricingOptionProps {
  title: string;
  info: string;
  advantages: string[];
  isSelected: boolean;
  onClickHandler(id: string): void;
}

/**
 * A card-like container detailing one specific pricing option.
 *
 * @param title the title of the pricing option.
 * @param info additional information about the pricing option.
 * @param advantages an array of featured bullet points about the pricing option.
 * @param isSelected a flag indicating whether this option was selected.
 * @param onClickHandler the event handler for the click action.
 */
export default function PricingOption({
  title,
  info,
  advantages,
  isSelected,
  onClickHandler,
}: PricingOptionProps) {
  const id = `${title}`;
  const listContent = advantages.map((a) => {
    return <li key={a}>{a}</li>;
  });
  const containerStyle =
    'text-center shadow-lg rounded-lg p-6 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer';
  const selectedStyle = ' outline outline-primary-500 dark:outline-primary-300';

  return (
    <div
      id={id}
      className={isSelected ? containerStyle + selectedStyle : containerStyle}
      onClick={(e) => onClickHandler(e.currentTarget.id)}
    >
      <h2 className="mb-2">{title}</h2>
      <p className="mb-4">{info}</p>
      <hr className="mb-4 h-px border-0 bg-primary-500 dark:bg-primary-300" />
      <ul className="ml-5 list-disc text-left">{listContent}</ul>
    </div>
  );
}
