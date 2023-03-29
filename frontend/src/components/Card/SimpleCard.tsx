interface SimpleCardProps {
  title: string;
  body: string;
}

export default function SimpleCard(props: SimpleCardProps) {
  return (
    <div>
      <h2 className="mb-2 text-sm font-medium  text-white">{props.title}</h2>
      <p className="text-gray-400">{props.body}</p>
    </div>
  );
}
