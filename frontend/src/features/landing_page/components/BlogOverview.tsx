import { PublicNextcloudImage } from '@/features/nextcloud_integration/components/PublicNextcloudImage';
import { useTranslation } from 'react-i18next';

const BlogOverview = () => {
  const { t } = useTranslation(['blog']);
  return (
    <section className="body-font overflow-hidden">
      <div className="container mx-auto py-24">
        <div className="-m-12 flex flex-wrap">
          {t('blog:blog_entries', { returnObjects: true }).map((entry) => (
            <div key={entry.title} className="flex flex-col items-start p-12 md:w-1/2">
              <h2 className="title-font my-4 text-2xl font-medium sm:text-3xl">
                {entry.title}
              </h2>
              <p className="mb-8 leading-relaxed">{entry.content}</p>
              <div className="mb-4 mt-auto flex w-full flex-wrap items-center border-b-2 border-neutral-100 pb-4">
                <span className="ml-auto mr-3 inline-flex items-center text-sm leading-none">
                  {entry.date}
                </span>
              </div>
              <a className="inline-flex items-center">
                <PublicNextcloudImage
                  path={entry.picture}
                  shareToken="2arzyJZYj2oNnHX"
                  alt="picture of the author"
                  className="h-12 w-12 shrink-0 rounded-full object-cover object-center"
                />
                <span className="flex grow flex-col pl-4">
                  <span className="title-font font-medium text-primary-500 dark:text-primary-300">
                    {entry.author}
                  </span>
                  <span className="mt-0.5 text-xs tracking-widest text-neutral-400">
                    {entry.author_role}
                  </span>
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogOverview;
