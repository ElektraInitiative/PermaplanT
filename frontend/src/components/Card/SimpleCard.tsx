interface SimpleCardProps {
  title: string;
  body: string;
}

export default function SimpleCard(props: SimpleCardProps) {
  return (
    <div>
      <h2 className="mb-2 text-sm font-medium">{props.title}</h2>
      <p>{props.body}</p>
    </div>
  );
}
