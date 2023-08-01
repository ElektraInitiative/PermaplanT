interface PageTitleProps {
  /** Page title text content. */
  title: string;
}

/** A simple custom-styled page header. */
const PageTitle = ({ title }: PageTitleProps) => {
  return <h1 className="mb-8 text-2xl">{title}</h1>;
};

export default PageTitle;
