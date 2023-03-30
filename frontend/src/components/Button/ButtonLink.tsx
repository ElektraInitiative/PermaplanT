import { Link } from 'react-router-dom';

interface ButtonLinkProps {
  title: string;
  to: string;
}

const ButtonLink = ({ title, to }: ButtonLinkProps) => {
  return (
    <Link to={to} className="items-center justify-center space-x-2 text-lg">
      <button>{title}</button>
    </Link>
  );
};

export default ButtonLink;
