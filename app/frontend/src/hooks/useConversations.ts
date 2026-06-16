import { useCallback, useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './storeHooks';
import {
  upsertConversation,
  setActiveConversation,
} from '../store/features/conversationsSlice';
import { setChats } from '../store/features/chatsSlice';

import {
  emitJoinConversation,
  emitHistoryRequest,
  listenForHistoryResponse,
} from '../socket/chat.socket';
import fetchit from '../utils/fetchit';

let conversationsSyncOwner = false;
let conversationsLoaded = false;

export const useConversations = () => {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector((s) => s.conversations.list);
  const user = useAppSelector((s) => s.user);
  const activeConversationId = useAppSelector(
    (s) => s.conversations.activeConversationId
  );

  const fetchConversations = useCallback(async () => {
    return await fetchit(
      `${import.meta.env.VITE_API_BASE_URL}/conversations/${user.username}`
    );
  }, [user.username]);

  type ConversationElement = {
    conversationId: string;
    id: string;
    name: string;
    avatarUrl: string;
  };

  useEffect(() => {
    if (conversationsSyncOwner) return;
    conversationsSyncOwner = true;

    ////// fetch conversations on mount
    const loadConversations = async () => {
      if (!user.username || conversationsLoaded) return;

      conversationsLoaded = true;

      const conversationData = await fetchConversations();
      conversationData?.data.forEach((conv: ConversationElement) => {
        if (conv.name) {
          dispatch(
            upsertConversation({
              username: conv.name,
              id: conv.id,
              conversationId: conv.conversationId,
              avatarUrl: conv.avatarUrl,
            })
          );
        } else {
          console.warn(
            'No username found in user state, skipping conversations fetch'
          );
        }
      });
    };

    loadConversations();

    ///////// Chat history management
    if (!activeConversationId) {
      return () => {
        conversationsSyncOwner = false;
      };
    }
    emitJoinConversation(activeConversationId);
    emitHistoryRequest(activeConversationId);

    const handleHistoryResponse = (data: {
      conversationId: string;
      chats: unknown[];
      username: string;
    }) => {
      if (data.conversationId === activeConversationId) {
        console.log('Received chat history for conversation: ', data);
        dispatch(
          setChats({
            conversationId: data.conversationId,
            chats: data.chats ?? [],
          })
        );
      }
    };

    const cleanup = listenForHistoryResponse(handleHistoryResponse);

    return () => {
      cleanup();
      conversationsSyncOwner = false;
    };
  }, [activeConversationId, dispatch, fetchConversations, user.username]);

  //////// Conversation management

  // activeConversation is derived from the conversations list and the activeConversationId. automaticaly recalculaes when either changes, ensuring it always reflects the current active conversation details.
  const activeConversation = useMemo(
    () =>
      conversations.find((c) => c.conversationId === activeConversationId) ??
      null,
    [conversations, activeConversationId]
  );

  const addConversation = useCallback(
    (username: string, privateChatId: string | undefined) => {
      dispatch(upsertConversation({ username, conversationId: privateChatId }));
      if (privateChatId) {
        dispatch(setActiveConversation(privateChatId));
      }
    },
    [dispatch]
  );

  const selectConversation = useCallback(
    (conversationId: string) => {
      dispatch(setActiveConversation(conversationId));
    },
    [dispatch]
  );

  return {
    conversations,
    activeConversation,
    activeConversationId,
    addConversation,
    selectConversation,
  } as const;
};

export default useConversations;
