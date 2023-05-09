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
  // Add some padding to the main content in order to prevent content from being clipped by the nav-bar.
  return (
    <div className="h-screen">
      <Navbar />
      <main className="h-full pt-16">{children}</main>
    </div>
  );
};

export default NavContainer;
