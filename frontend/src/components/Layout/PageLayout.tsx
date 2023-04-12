interface PageLayoutProps {
  children: React.ReactNode;
  styleNames?: string;
}

const PageLayout = ({ children, styleNames }: PageLayoutProps) => {
  return (
    // add 68px to the top padding to account for the navbar
    <div className={`mx-auto w-full py-8 px-4 pt-[68px] md:w-[900px] ${styleNames}`}>
      {children}
    </div>
  );
};

export default PageLayout;
