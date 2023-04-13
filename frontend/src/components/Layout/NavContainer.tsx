import Navbar from './Navbar';

interface NavContainerProps {
  children: React.ReactNode;
}

/**
 * A container that wraps the Navbar with the main content.
 *
 * @param props.children The children of the NavContainer.
 */
const NavContainer = ({ children }: NavContainerProps) => {
  return (
    <div>
      <Navbar />
      <main className="pt-16">{children}</main>
    </div>
  );
};

export default NavContainer;
