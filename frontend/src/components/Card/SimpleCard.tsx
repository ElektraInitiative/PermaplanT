interface SimpleCardProps {
  /** title of the card */
  title: string;
  /** text paragraph */
  body: string;
}

/**
 * Simple text card component
 * @param props.title title of the card
 * @param props.body text paragraph
 */
export default function SimpleCard(props: SimpleCardProps) {
  return (
    <div>
      <h2 className="mb-2 text-sm font-medium">{props.title}</h2>
      <p>{props.body}</p>
    </div>
  );
}
