interface PageLayoutProps {
  children: React.ReactNode;
  styleNames?: string;
}

const PageLayout = ({ children, styleNames }: PageLayoutProps) => {
  return <div className={`mx-auto w-full py-8 px-4 md:w-[900px] ${styleNames}`}>{children}</div>;
};

export default PageLayout;
