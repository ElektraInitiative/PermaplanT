import { useEffect, useState } from "react"
import SimpleFormInput from "@/components/Form/SimpleFormInput"
import SimpleButton from "@/components/Button/SimpleButton"
import { getConversations, sendMessage } from "../api/chat"

/**
 * component used for testing different webdav api call
 */
export const ChatTest = () => {
  const [message, setMessage] = useState<string>("")
  const chatToken = ""

  useEffect(() => {
    getConversations()
  }, [])

  return <div className="flex flex-col justify-center items-center gap-4 mt-8">
    {/* upload an image to path */}
    <div className="flex flex-col  gap-4 w-[50%]">
      <SimpleFormInput
        id="message"
        labelText="write a message"
        placeHolder="message..."
        onChange={(e) => setMessage(e.target.value)}
        isArea={true}
      ></SimpleFormInput>
      <SimpleButton onClick={() => sendMessage(chatToken, message)}>send</SimpleButton>
    </div>
  </div>

}
