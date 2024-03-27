import { AuthContextProps } from 'react-oidc-context';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { ChatMessage } from '../api/chat';

/**
 * generate classes to align the logged in users messages right
 */
function alignOwnMessageRight(auth: AuthContextProps, message: ChatMessage): string {
  const classes =
    message.actorDisplayName === auth.user?.profile.name ? ' justify-end items-end' : '';
  return classes;
}

export const MessageList = ({ messages }: { messages: Array<ChatMessage> }) => {
  const auth = useSafeAuth();
  return (
    <ul className="flex flex-col">
      {messages.map((message) => {
        const date = new Date(message.timestamp * 1000);
        return (
          <li
            key={'chatMessage' + message.id}
            className={'flex flex-col p-2' + alignOwnMessageRight(auth, message)}
          >
            <div className="w-fit text-sm italic">{message.actorDisplayName}</div>
            <div className="flex w-fit flex-col gap-2 rounded bg-neutral-700 p-2">
              {message.message}
              <div className="h-[1px] w-full bg-neutral-500"></div>
              <div className="text-xs">{date.toString()}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
