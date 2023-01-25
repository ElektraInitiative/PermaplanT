interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  return <h1 className="mb-8 text-2xl">{title}</h1>;
};

export default PageTitle;
