import Navbar from './Navbar';

interface NavContainerProps {
  children: React.ReactNode;
}

const NavContainer = ({ children }: NavContainerProps) => {
  return (
    <div className="">
      <Navbar />
      {children}
    </div>
  );
};

export default NavContainer;
