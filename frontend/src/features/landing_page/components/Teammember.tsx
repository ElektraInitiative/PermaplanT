import { PublicNextcloudImage } from '@/features/nextcloud_integration/components/PublicNextcloudImage';

export const Teammember = ({ name, path, role }: { name: string; path: string; role: string }) => {
  return (
    <div className="w-full p-2 md:w-1/2 xl:w-1/3">
      <div className="flex h-full items-center rounded-lg border border-gray-200 p-4 dark:border-neutral-700">
        <PublicNextcloudImage
          path={path}
          shareToken="2arzyJZYj2oNnHX"
          alt="picture of a team member"
          className="mr-4 h-16 w-16 shrink-0 rounded-full bg-gray-100 object-cover object-center"
        />
        <div className="grow">
          <h2 className="title-font font-medium text-primary-500 dark:text-primary-300">{name}</h2>
          <p className="text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
};
