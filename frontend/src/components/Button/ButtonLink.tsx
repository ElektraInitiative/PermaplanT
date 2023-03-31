import { Link } from 'react-router-dom';

interface ButtonLinkProps {
  title: string;
  to: string;
  className?: string;
}

const ButtonLink = ({ title, to, className = '' }: ButtonLinkProps) => {
  return (
    <Link to={to} className={`items-center ${className} justify-center space-x-2`}>
      <button>{title}</button>
    </Link>
  );
};

export default ButtonLink;
