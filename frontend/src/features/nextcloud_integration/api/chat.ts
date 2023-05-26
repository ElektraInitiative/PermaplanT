// Documentation is from https://nextcloud-talk.readthedocs.io/en/latest/chat/

import { createNextcloudAPI } from "@/config/axios";

export const sendMessage = (chatToken: string, message: string) => {
  let http = createNextcloudAPI()
  http.defaults.headers['OCS-APIRequest'] = true
  http.defaults.headers['Accept'] = 'application/json'
  http.defaults.headers['format'] = 'json'

  http.post("/ocs/v2.php/apps/spreed/api/v1/chat/" + chatToken, {
    message
  })
}


export type TalkConversation = {
    id: number;
    token: string;
    type: number;
    name: string;
    displayName: string;
    objectType: string;
    objectId: string;
    participantType: number;
    participantFlags: number;
    readOnly: number;
    hasPassword: boolean;
    hasCall: boolean;
    canStartCall: boolean;
    lastActivity: number;
    lastReadMessage: number;
    unreadMessages: number;
    unreadMention: boolean;
    unreadMentionDirect: boolean;
    isFavorite: boolean;
    canLeaveConversation: boolean;
    canDeleteConversation: boolean;
    notificationLevel: number;
    notificationCalls: number;
    lobbyState: number;
    lobbyTimer: number;
    lastPing: number;
    sessionId: string;
    lastMessage: {
        id: number;
        token: string;
        actorType: string;
        actorId: string;
        actorDisplayName: string;
        timestamp: number;
        message: string;
        messageParameters: any[];
        systemMessage: string;
        messageType: string;
        isReplyable: boolean;
        referenceId: string;
        reactions: Record<string, unknown>;
        expirationTimestamp: number;
    };
    sipEnabled: number;
    actorType: string;
    actorId: string;
    attendeeId: number;
    permissions: number;
    attendeePermissions: number;
    callPermissions: number;
    defaultPermissions: number;
    canEnableSIP: boolean;
    attendeePin: string;
    description: string;
    lastCommonReadMessage: number;
    listable: number;
    callFlag: number;
    messageExpiration: number;
};
export const getConversations = async (): Promise<Array<TalkConversation>> => {
  let http = createNextcloudAPI()
  http.defaults.headers['OCS-APIRequest'] = true

  const data = await http.get("/ocs/v2.php/apps/spreed/api/v4/room")
  return data.data.ocs.data
}

export enum ConversationType {
  OneToOne,
  Group,
  Public,
  Changelog,
  //When a user is deleted from the server or removed from all their conversations, 1 "One to one" rooms are converted to this type)
  FormerOneToOne,
}
export type CreateConversationOptions = {
  roomType: ConversationType;
  // User ID (roomType = 1), group ID (roomType = 2 - optional), circle ID (roomType = 2, source = 'circles'], only available with circles-support capability)
  invite?: string;
  // The source for the invite, only supported on roomType = 2 for groups and circles (only available with circles-support capability)
  source?: string;
  // Conversation name up to 255 characters (Not available for roomType = 1)
  roomName?: string;
  // Type of an object this room references, currently only allowed value is 'room' to indicate the parent of a breakout room (See Object types)
  objectType?: string;
  // ID of an object this room references, room token is used for the parent of a breakout room
  objectId?: string;
}
export const createConversation = async (options: CreateConversationOptions) => {
  let http = createNextcloudAPI()
  http.defaults.headers['OCS-APIRequest'] = true
  return http.post("/ocs/v2.php/apps/spreed/api/v4/room", {...options, roomType: options.roomType + 1 })
}


enum LookIntoFuture {
  Poll = 1, // Poll and wait for new message
  GetHistory = 0, // Get history of a conversation
}
enum SetReadMarker {
  Auto = 1, // Automatically set the read timer after fetching the messages
  Manual = 0, // use Manual when your client calls 'Mark chat as read manually'. (Default: Auto)
}
type GetChatMessagesOptions = {
  lookIntoFuture?: LookIntoFuture;
  // Number of chat messages to receive (100 by default, 200 at most)
  limit?: number;
  // Serves as an offset for the query. The lastKnownMessageId for the next page is available in the X-Chat-Last-Given header.
  lastKnownMessageId?: number;
  // Send the last X-Chat-Last-Common-Read header you got if you are interested in updates of the common read value.
  // A 304 response does not allow custom headers and otherwise the server cannot know if your value is modified or not.
  lastCommonReadId?: number;
  // Only applicable when lookIntoFuture = 1. Number of seconds to wait for new messages (30 by default, 60 at most)
  timeout?: number;
  // Auto to automatically set the read timer after fetching the messages
  // use Manual when your client calls 'Mark chat as read manually'. (Default: Auto)
  setReadMarker?: SetReadMarker;
  // 1 to include the last known message as well (Default: 0)
  includeLastKnown?: number;
  // Set to 1 when the user status should not be automatically set to online (default: 0)
  noStatusUpdate?: number;
  // 0 to not mark notifications as read (Default: 1, only available with chat-keep-notifications capability)
  markNotificationsAsRead?: number;
};
export const getChatMessages = async (token: string, options: GetChatMessagesOptions) => {
  let http = createNextcloudAPI()
  http.defaults.headers['OCS-APIRequest'] = true
  return http.get("/ocs/v2.php/apps/spreed/api/v1/chat/" + token, options)
}
