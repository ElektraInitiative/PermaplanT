import { Link } from 'react-router-dom';

interface ButtonLinkProps {
  title: string;
  to: string;
  className?: string;
}

/**
 * A styled link that has properties of a button.
 * @param props.title The title of the button.
 * @param props.to The path to navigate to.
 * @param props.className The className styling of the button.
 */
const ButtonLink = ({ title, to, className = '' }: ButtonLinkProps) => {
  return (
    <Link to={to} className={`items-center ${className} justify-center space-x-2`}>
      <button>{title}</button>
    </Link>
  );
};

export default ButtonLink;
