export interface PageLayoutProps {
  /** react children */
  children: React.ReactNode;
  /** css classes which will be added to the default styles */
  styleNames?: string;
}

/** Common default page layout for pages which don't require some special layout */
const PageLayout = ({ children, styleNames }: PageLayoutProps) => {
  return <div className={`mx-auto w-full px-4 py-8 md:w-[900px] ${styleNames}`}>{children}</div>;
};

export default PageLayout;
