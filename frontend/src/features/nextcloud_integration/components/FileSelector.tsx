import { UploadFile } from './UploadFile';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { useNextcloudWebDavClient } from '@/config/nextcloud_client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileStat, WebDAVClient } from 'webdav';

type FileSelectorProps = {
  /** path to the directory starting from the users root */
  path: string;
  /** fires when an element is selected */
  onSelect: (item: FileStat) => void;
};

const matchesSearchTerm = (searchTerm: string) => (file: FileStat) => {
  const regex = new RegExp(searchTerm.toLowerCase());
  return regex.test(file.basename.toLowerCase());
};

const sortByNameAsc = (a: FileStat, b: FileStat) => {
  const nameA = a.basename.toLowerCase();
  const nameB = b.basename.toLowerCase();
  return nameA < nameB ? -1 : nameB < nameA ? 1 : 0;
};

const sortByNameDsc = (a: FileStat, b: FileStat) => {
  const nameA = a.basename.toLowerCase();
  const nameB = b.basename.toLowerCase();
  return nameA > nameB ? -1 : nameB > nameA ? 1 : 0;
};

const sortByDateAsc = (a: FileStat, b: FileStat) => {
  const dateA = new Date(a.lastmod);
  const dateB = new Date(b.lastmod);
  return dateA < dateB ? -1 : dateB < dateA ? 1 : 0;
};

const sortByDateDsc = (a: FileStat, b: FileStat) => {
  const dateA = new Date(a.lastmod);
  const dateB = new Date(b.lastmod);
  return dateA > dateB ? -1 : dateB > dateA ? 1 : 0;
};

interface SortMethods {
  [key: string]: (a: FileStat, b: FileStat) => number;
}
const sortMethods: SortMethods = {
  name_asc: sortByNameAsc,
  name_dsc: sortByNameDsc,
  date_asc: sortByDateAsc,
  date_dsc: sortByDateDsc,
};

const sortFiles = (attribute: 'name' | 'date', order: 'asc' | 'dsc') => {
  const key: string = attribute + '_' + order;
  return sortMethods[key];
};

/** component to select a file from the top level of a given Nextcloud directory */
export const FileSelector = (props: FileSelectorProps) => {
  const { path, onSelect } = props;
  const webdav = useNextcloudWebDavClient();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortAttribute, setSortAttribute] = useState<'name' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'dsc'>('asc');

  const { t } = useTranslation(['fileSelector']);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(['files', path], {
    queryFn: () => (webdav as WebDAVClient).getDirectoryContents('/remote.php/webdav/' + path),
    meta: {
      errorMessage: t('fileSelector:error'),
    },
    staleTime: 10000,
    refetchOnWindowFocus: false,
    enabled: !!webdav && !!path,
  });

  if (isLoading) {
    return (
      <div className="absolute left-1/2 top-1/2 h-[12vh] -translate-x-1/2 -translate-y-1/2">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-row items-end gap-4">
        <div className="flex-1">
          <SimpleFormInput
            id="FileInput"
            labelContent={t('fileSelector:search')}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-32">
          <UploadFile
            path={path}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['files', path] });
            }}
          />
        </div>
      </div>
      <ul className="mt-3 overflow-auto break-words pr-1 text-sm sm:text-base">
        <li className="mb-2 grid cursor-pointer grid-cols-2 items-center justify-between gap-4 font-bold">
          <p
            onClick={() => {
              if (sortAttribute === 'name') {
                if (sortOrder === 'asc') setSortOrder('dsc');
                else setSortOrder('asc');
              }
              setSortAttribute('name');
            }}
            className="hover:text-primary-400"
          >
            Filename
          </p>
          <p
            onClick={() => {
              if (sortAttribute === 'date') {
                if (sortOrder === 'asc') setSortOrder('dsc');
                else setSortOrder('asc');
              }
              setSortAttribute('date');
            }}
            className="text-right text-neutral-400 hover:text-primary-400"
          >
            Last Modified
          </p>
        </li>

        {data && Array.isArray(data)
          ? data
              .filter((item) => item.type === 'file')
              .filter(matchesSearchTerm(searchTerm))
              .sort(sortFiles(sortAttribute, sortOrder))
              .map((file) => (
                <li
                  className="mb-1 grid cursor-pointer grid-cols-2 items-center justify-between gap-4 hover:text-primary-400"
                  key={file.filename}
                  onClick={() => onSelect(file)}
                >
                  <p>{file.basename}</p>
                  <p className="text-right text-neutral-400">{file.lastmod}</p>
                </li>
              ))
          : []}
      </ul>
    </>
  );
};
