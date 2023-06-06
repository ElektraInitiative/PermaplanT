import { useEffect, useState } from "react"
import SimpleFormInput from "@/components/Form/SimpleFormInput"
import SimpleButton from "@/components/Button/SimpleButton"
import { getChatMessages, getConversations, LookIntoFuture, sendMessage, TalkConversation } from "../api/chat"
import { toast } from "react-toastify"
import ConversationForm from "../api/ConversationForm"
import { useSafeAuth } from "@/hooks/useSafeAuth"

/**
 * component used for testing different webdav api call
 */
export const ChatTest = () => {
  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<any>([])
  const [conversations, setConversations] = useState<Array<TalkConversation>>([])
  const [selectedConversation, setSelectedConversation] = useState<TalkConversation>()
  const auth = useSafeAuth()
  console.log(auth)


  async function fetchConversations() {
    const conversations = await getConversations()
    console.log(conversations)
    setConversations(conversations)
  }

  async function fetchMessages() {
    if (selectedConversation) {
      const messages = await getChatMessages(selectedConversation?.token, {
        lookIntoFuture: LookIntoFuture.GetHistory
      })
      console.log(messages.data.ocs.data)
      setMessages(messages.data.ocs.data)
    } else {
      toast("no convo selected", { type: 'error' })
    }
  }

  function send() {
    if (selectedConversation) {
      sendMessage(selectedConversation.token, message)
      toast(("message: '" + message + "' sent"), { type: 'success' })
    } else {
      toast("no convo selected", { type: 'error' })
    }
  }

  function alignOwnMessageRight(message){
    const classes = message.actorDisplayName === auth.user?.profile.name ? " justify-end items-end" : ""
    console.log(classes)
    return classes
  }

  useEffect(() => {
    fetchMessages()
  }, [selectedConversation])

  useEffect(() => {
    fetchConversations()
  }, [])

  return <div className="flex flex-col justify-center items-center gap-4 mt-8">
    <h2>conversations</h2>
    <ul>
      {conversations.map(item => {
        return <li className="cursor-pointer hover:text-primary-400" key={item.id} onClick={() => setSelectedConversation(item)}>{item.displayName}</li>
      })}
    </ul>
    <div className="h-[1px] w-[70%] bg-neutral-500"></div>
    <h2>send message</h2>
    <div className="flex flex-col  gap-4 w-[50%]">
      <SimpleFormInput
        id="message"
        labelText={"write a message to " + (selectedConversation ? selectedConversation.displayName : "")}
        placeHolder="message..."
        onChange={(e) => setMessage(e.target.value)}
        isArea={true}
      ></SimpleFormInput>
      <SimpleButton onClick={send}>send</SimpleButton>
    </div>
    <div className="h-[1px] w-[70%] bg-neutral-500"></div>
    <div>
      <h2 className="mb-2">Create conversation</h2>
      <ConversationForm></ConversationForm>
    </div>
    <div className="h-[1px] w-[70%] bg-neutral-500"></div>
    <div className="flex flex-col  gap-4 w-[50%]" >
      <h2>Chat messages</h2>
      <ul className="flex flex-col">
        { messages.map(message => <li key={"chatMessage" + message.id} className={"flex flex-col p-2" + alignOwnMessageRight(message)}>
          <div className="w-fit">{message.message}</div>
          <div className="w-fit italic text-sm">{message.actorDisplayName}</div>
          <div className="h-[1px] w-full bg-neutral-500"></div>
        </li>) }
      </ul>
      <SimpleButton onClick={fetchMessages}>fetch messages</SimpleButton>
    </div>
  </div>

}
