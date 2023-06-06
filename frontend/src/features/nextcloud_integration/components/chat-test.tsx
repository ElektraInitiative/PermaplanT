import { useEffect, useState } from "react"
import SimpleFormInput from "@/components/Form/SimpleFormInput"
import SimpleButton from "@/components/Button/SimpleButton"
import { ChatMessage, getChatMessages, getConversations, LookIntoFuture, sendMessage, TalkConversation } from "../api/chat"
import { toast } from "react-toastify"
import ConversationForm from "./ConversationForm"
import { MessageList } from "./MessageList"
import ModalContainer from "@/components/Modals/ModalContainer"
import TransparentBackground from "@/components/TransparentBackground"
import IconButton from "@/components/Button/IconButton"
import { ReactComponent as AddIcon } from '@/icons/add.svg';

/**
 * component used for testing different chat api calls
 */
export const ChatTest = () => {
  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<Array<ChatMessage>>([])
  const [conversations, setConversations] = useState<Array<TalkConversation>>([])
  const [selectedConversation, setSelectedConversation] = useState<TalkConversation>()
  const [showConversationForm, setShowConversationForm] = useState<boolean>(false)

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
      messages.reverse()
      setMessages(messages)
    } else {
      toast("no convo selected", { type: 'error' })
    }
  }

  async function send() {
    if (selectedConversation) {
      await sendMessage(selectedConversation.token, message)
      fetchMessages()
      toast(("message: '" + message + "' sent"), { type: 'success' })
    } else {
      toast("no convo selected", { type: 'error' })
    }
  }


  useEffect(() => {
    fetchMessages()
  }, [selectedConversation])

  useEffect(() => {
    fetchConversations()
  }, [])

  return <div className="flex flex-col justify-center items-center gap-4 mt-8">
    <TransparentBackground
      onClick={() => {
        setShowConversationForm(false);
      }}
      show={showConversationForm}
    />
    <ModalContainer show={showConversationForm}>
      <div className="bg-neutral-700 p-4">
        <h2 className="mb-2">Create conversation</h2>
        <ConversationForm></ConversationForm>
      </div>
    </ModalContainer>
    <div className="flex w-full gap-4 m-5 justify-center">
      <div className="border-r border-neutral-500 p-4">
        <h2>conversations</h2>
        <IconButton title="create new conversation" onClick={() => setShowConversationForm(true)}><AddIcon /></IconButton>
        <ul>
          {conversations.map(item => {
            return <li className="cursor-pointer hover:text-primary-400" key={item.id} onClick={() => setSelectedConversation(item)}>{item.displayName}</li>
          })}
        </ul>
      </div>
        {selectedConversation &&
      <div className="flex flex-col gap-4 w-[50%]" >
        <h2>Chat messages</h2>
        {messages.length > 0 &&
          <MessageList messages={messages} />
        }
        <SimpleFormInput
          id="message"
          labelText={"write a message to " + (selectedConversation ? selectedConversation.displayName : "")}
          placeHolder="message..."
          onChange={(e) => setMessage(e.target.value)}
          isArea={true}
        ></SimpleFormInput>
        <SimpleButton onClick={send}>send</SimpleButton>
        {/* <SimpleButton onClick={fetchMessages}>fetch messages</SimpleButton> */}
      </div>
      }
    </div>
  </div>

}
