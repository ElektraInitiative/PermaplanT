interface PageLayoutProps {
  children: React.ReactNode;
  styleNames?: string;
}

const WidePageLayout = ({ children, styleNames }: PageLayoutProps) => {
  return (
    <div className={`mx-auto py-8 px-4 sm:w-[75%] md:w-[80%] lg:w-[70%] xl:w-[65%] ${styleNames}`}>
      {children}
    </div>
  );
};

export default WidePageLayout;
