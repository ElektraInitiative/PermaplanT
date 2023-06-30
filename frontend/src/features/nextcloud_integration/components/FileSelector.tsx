import SimpleFormInput from "@/components/Form/SimpleFormInput";
import { useNextcloudWebDavClient } from "@/config/nextcloud_client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FileStat, ResponseDataDetailed, WebDAVClient } from "webdav";

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
  return a.basename < b.basename ? -1 : b.basename < a.basename ? 1 : 0
}

const sortByNameDsc = (a: FileStat, b: FileStat) => {
  return a.basename > b.basename ? -1 : b.basename > a.basename ? 1 : 0
}

const sortByDateDsc = (a: FileStat, b: FileStat) => {
  return a.lastmod < b.lastmod ? -1 : b.lastmod < a.lastmod ? 1 : 0
}

const sortByDateAsc = (a: FileStat, b: FileStat) => {
  return a.lastmod > b.lastmod ? -1 : b.lastmod > a.lastmod ? 1 : 0
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

  const { data } = useQuery(['files', path], {
    queryFn: () => (webdav as WebDAVClient).getDirectoryContents('/remote.php/webdav/' + path),
    refetchOnWindowFocus: false,
    enabled: !!webdav && !!path,
  });

  console.log(data)
  return <div className="w-full p-8">
    <SimpleFormInput id="FileInput" labelText="search for a file in this directory" onChange={(e) => setSearchTerm(e.target.value)} />
    <ul className="mt-2">
      <li
        className="cursor-pointer flex items-center justify-between gap-4 font-bold mb-2"
      >
        <p onClick={() => {
          if(sortAttribute === "name"){
            if(sortOrder === "asc") setSortOrder("dsc")
            else setSortOrder("asc")
          }
          setSortAttribute("name")
        }}
        className="hover:text-primary-400"
        >Filename</p>
        <p onClick={() => {
          if(sortAttribute === "date"){
            if(sortOrder === "asc") setSortOrder("dsc")
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
