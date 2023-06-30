import SimpleFormInput from "@/components/Form/SimpleFormInput";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { useNextcloudWebDavClient } from "@/config/nextcloud_client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileStat, WebDAVClient } from "webdav";
import { UploadFile } from "./UploadFile";

type FileSelectorProps = {
  /** path to the directory starting from the users root */
  path: string
  /** fires when an element is selected */
  onSelect: (item: FileStat) => void
}

const matchesSearchTerm = (searchTerm: String) => (file: FileStat) => {
  const regex = new RegExp(searchTerm.toLowerCase())
  return regex.test(file.basename.toLowerCase())
}

const sortByNameAsc = (a: FileStat, b: FileStat) => {
  const nameA = a.basename.toLowerCase()
  const nameB = b.basename.toLowerCase()
  return nameA < nameB ? -1 : nameB < nameA ? 1 : 0
}

const sortByNameDsc = (a: FileStat, b: FileStat) => {
  const nameA = a.basename.toLowerCase()
  const nameB = b.basename.toLowerCase()
  return nameA > nameB ? -1 : nameB > nameA ? 1 : 0
}

const sortByDateDsc = (a: FileStat, b: FileStat) => {
  const dateA = new Date(a.lastmod)
  const dateB = new Date(b.lastmod)
  return dateA < dateB ? -1 : dateA < dateB ? 1 : 0
}

const sortByDateAsc = (a: FileStat, b: FileStat) => {
  const dateA = new Date(a.lastmod)
  const dateB = new Date(b.lastmod)
  return dateA > dateB ? -1 : dateA > dateB ? 1 : 0
}

interface SortMethods {
  [key: string]: (a: FileStat, b: FileStat) => number;
}
const sortMethods: SortMethods = {
  "name_asc": sortByNameAsc,
  "name_dsc": sortByNameDsc,
  "date_asc": sortByDateAsc,
  "date_dsc": sortByDateDsc
}

const sortFiles = (attribute: "name" | "date", order: "asc" | "dsc") => {
  const key: string = attribute + "_" + order
  return sortMethods[key]
}

/** component to select a file from the top level of a given Nextcloud directory */
export const FileSelector = (props: FileSelectorProps) => {
  const { path, onSelect } = props
  const webdav = useNextcloudWebDavClient();
  const [searchTerm, setSearchTerm] = useState<String>("")
  const [sortAttribute, setSortAttribute] = useState<"name" | "date">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "dsc">("asc")

  const { t } = useTranslation(["fileSelector"])

  const { data, refetch, isLoading } = useQuery(['files', path], {
    queryFn: () => (webdav as WebDAVClient).getDirectoryContents('/remote.php/webdav/' + path),
    refetchOnWindowFocus: false,
    enabled: !!webdav && !!path,
  });

  if(isLoading){
    return <LoadingSpinner />
  }

  return <div className="w-full p-8">
    <div className="flex items-end gap-4">
      <div className="flex-1">
        <SimpleFormInput id="FileInput" labelText={t("fileSelector:search")} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <div className='w-32'>
        <UploadFile path={path} onSuccess={() => {
          refetch()
        }} />
      </div>
    </div>
    <ul className="mt-2">
      <li
        className="cursor-pointer flex items-center justify-between gap-4 font-bold mb-2"
      >
        <p onClick={() => {
          if (sortAttribute === "name") {
            if (sortOrder === "asc") setSortOrder("dsc")
            else setSortOrder("asc")
          }
          setSortAttribute("name")
        }}
          className="hover:text-primary-400"
        >Filename</p>
        <p onClick={() => {
          if (sortAttribute === "date") {
            if (sortOrder === "asc") setSortOrder("dsc")
            else setSortOrder("asc")
          }
          setSortAttribute("date")
        }}
          className="text-neutral-400 hover:text-primary-400">Last Modified</p>
      </li>

      {data && Array.isArray(data)
        ? data
          .filter(item => item.type === 'file')
          .filter(matchesSearchTerm(searchTerm))
          .sort(sortFiles(sortAttribute, sortOrder))
          .map((file) => (
            <li
              className="cursor-pointer hover:text-primary-400 flex items-center justify-between gap-4"
              key={file.filename}
              onClick={() => onSelect(file)}
            >
              <p>{file.basename}</p>
              <p className="text-sm text-neutral-400">{file.lastmod}</p>
            </li>
          ))
        : []}
    </ul>
  </div>
}
