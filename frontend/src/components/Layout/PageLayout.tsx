interface PageLayoutProps {
  children: React.ReactNode;
  styleNames?: string;
}

const PageLayout = ({ children, styleNames }: PageLayoutProps) => {
  return <div className={`mx-auto w-full px-4 py-8 md:w-[900px] ${styleNames}`}>{children}</div>;
};

export default PageLayout;
