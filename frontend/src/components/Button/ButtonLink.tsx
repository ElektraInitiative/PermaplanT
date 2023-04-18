import { Link } from 'react-router-dom';

interface ButtonLinkProps {
  /** The title of the button. */
  title: string;
  /** The path to navigate to. */
  to: string;
  /** The className styling of the button. */
  className?: string;
}

/**
 * A styled link that has properties of a button.
 */
const ButtonLink = ({ title, to, className = '' }: ButtonLinkProps) => {
  return (
    <Link to={to} className={`items-center ${className} justify-center space-x-2`}>
      <button>{title}</button>
    </Link>
  );
};

export default ButtonLink;
