import { useSafeAuth } from "@/hooks/useSafeAuth"
import { AuthContextProps } from "react-oidc-context"
import { ChatMessage } from "../api/chat"


/**
  * generate classes to align the logged in users messages right
*/
function alignOwnMessageRight(auth: AuthContextProps, message: ChatMessage): string {
  const classes = message.actorDisplayName === auth.user?.profile.name ? " justify-end items-end" : ""
  return classes
}

export const MessageList = ({ messages }: { messages: Array<ChatMessage> }) => {
  const auth = useSafeAuth()
  return <ul className="flex flex-col">
    {messages.map(message => <li key={"chatMessage" + message.id} className={"flex flex-col p-2" + alignOwnMessageRight(auth, message)}>
      <div className="w-fit">{message.message}</div>
      <div className="w-fit italic text-sm">{message.actorDisplayName}</div>
      <div className="h-[1px] w-full bg-neutral-500"></div>
    </li>)}
  </ul>
}
