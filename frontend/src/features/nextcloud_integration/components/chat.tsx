import {
  ChatMessage,
  getChatMessages,
  getConversations,
  LookIntoFuture,
  sendMessage,
  TalkConversation,
} from '../api/chat';
import ConversationForm from './ConversationForm';
import { MessageList } from './MessageList';
import IconButton from '@/components/Button/IconButton';
import SimpleButton from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import ModalContainer from '@/components/Modals/ModalContainer';
import TransparentBackground from '@/components/TransparentBackground';
import { ReactComponent as AddIcon } from '@/svg/icons/add.svg';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

/**
 * Prototypical chat component implementation
 */
export const Chat = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);
  const [selectedConversation, setSelectedConversation] = useState<TalkConversation>();
  const [showConversationForm, setShowConversationForm] = useState<boolean>(false);

  const newMessages = useQuery(['newMessages', selectedConversation], fetchNewMessages, {
    refetchInterval: 5000, // Polling interval in milliseconds (e.g., 5000 = 5 seconds)
  });

  const conversations = useQuery(['conversations'], getConversations, {
    refetchInterval: 5000, // Polling interval in milliseconds (e.g., 5000 = 5 seconds)
  });

  async function fetchMessageHistory() {
    if (selectedConversation) {
      const messageHistory = await getChatMessages(selectedConversation?.token, {
        lookIntoFuture: LookIntoFuture.GetHistory,
      });
      messageHistory.reverse();
      setMessages(messageHistory);
    }
  }

  async function fetchNewMessages() {
    if (selectedConversation) {
      return getChatMessages(selectedConversation?.token, {
        lookIntoFuture: LookIntoFuture.Poll,
        lastKnownMessageId: messages[messages.length - 1].id,
      });
    } else {
      return null;
    }
  }

  async function send() {
    if (selectedConversation) {
      await sendMessage(selectedConversation.token, message);
      newMessages.refetch();
      toast("message: '" + message + "' sent", { type: 'success' });
    } else {
      toast('no convo selected', { type: 'error' });
    }
  }

  useEffect(() => {
    fetchMessageHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

  useEffect(() => {
    const data = newMessages.data;
    if (data) {
      setMessages([...messages, ...data]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMessages.data]);

  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-4">
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
      <div className="m-5 flex w-full justify-center gap-4">
        <div className="border-r border-neutral-500 p-4">
          <h2>conversations</h2>
          <IconButton title="create new conversation" onClick={() => setShowConversationForm(true)}>
            <AddIcon />
          </IconButton>
          <ul>
            {conversations.data?.map((item) => {
              return (
                <li
                  className="cursor-pointer hover:text-primary-400"
                  key={item.id}
                  onClick={() => setSelectedConversation(item)}
                >
                  {item.displayName}
                </li>
              );
            })}
          </ul>
        </div>
        <AnimatePresence>
          {selectedConversation && (
            <motion.div
              className="w-[50%]"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 100,
                transition: { delay: 0, duration: 0.3 },
              }}
              exit={{
                opacity: 0,
                transition: { delay: 0, duration: 0.3 },
              }}
            >
              <div className="flex flex-col gap-4">
                <h2>Chat messages</h2>
                {messages.length > 0 && (
                  <motion.div
                    className="h-80 overflow-y-scroll"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 100,
                      transition: { delay: 0, duration: 0.3 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { delay: 0, duration: 0.3 },
                    }}
                  >
                    <MessageList messages={messages} />
                  </motion.div>
                )}
                <SimpleFormInput
                  id="message"
                  labelText={
                    'write a message to ' +
                    (selectedConversation ? selectedConversation.displayName : '')
                  }
                  onChange={(e) => setMessage(e.target.value)}
                ></SimpleFormInput>
                <SimpleButton onClick={send}>send</SimpleButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
