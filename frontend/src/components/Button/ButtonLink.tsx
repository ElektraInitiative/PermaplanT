import { MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';

interface ButtonLinkProps {
  /** The title of the button. */
  title: string;
  /** The path to navigate to. */
  to: string;
  /** The className styling of the button. */
  className?: string;
  /** Clickhandler for the button. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * A styled link that has properties of a button.
 */
const ButtonLink = ({ title, to, className = '', onClick }: ButtonLinkProps) => {
  return (
    <Link
      to={to}
      className={`flex items-center ${className} justify-center space-x-2 active:text-primary-700 dark:active:text-primary-400`}
    >
      <button onClick={onClick}>{title}</button>
    </Link>
  );
};

export default ButtonLink;
