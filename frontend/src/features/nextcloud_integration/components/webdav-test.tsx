import { createNextcloudWebDavClient } from "@/config/nextcloud_client"
import { useEffect, useState } from "react"
import { ImageBlob } from "./ImageBlob"
import { BufferLike, ResponseDataDetailed } from "webdav"

/**
 * component used for testing different webdav api call
 */
export const WebdavTest = () => {
  const [files, setFiles] = useState([])
  const defaultImage: string | BufferLike | ResponseDataDetailed<string | BufferLike> = ""
  const [image, setImage] = useState(defaultImage)
  const webdav = createNextcloudWebDavClient()

  useEffect(() => {
    getFiles()
  }, [])

  async function getFiles() {
    const files = await webdav.getDirectoryContents('/remote.php/webdav/Photos')
    console.log(files)
    setFiles(files)
  }

  async function getImage(filename: string) {
    const imageBuffer = await webdav.getFileContents(filename)
    setImage(imageBuffer)
  }

  return <div className="flex flex-col">

    <ul>
      {files.map(file =>
      <li className="cursor-pointer hover:text-primary-400" onClick={() => getImage(file.filename)}>
        {file.filename}
      </li>)}
    </ul>
    <div className="w-64">
      <ImageBlob image={new Blob([image])} />
    </div>
  </div>

}
