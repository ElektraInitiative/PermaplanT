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
    { messages.map( message => {
      const date = new Date(message.timestamp * 1000)
      return <li key={"chatMessage" + message.id} className={"flex flex-col p-2" + alignOwnMessageRight(auth, message)}>
        <div className="w-fit italic text-sm">{message.actorDisplayName}</div>
        <div className="w-fit p-2 bg-neutral-700 rounded flex flex-col gap-2">
          {message.message}
          <div className="h-[1px] bg-neutral-500 w-full"></div>
          <div className="text-xs">{date.toString()}</div></div>
      </li>
    })}
  </ul>
}
