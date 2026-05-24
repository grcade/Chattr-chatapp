import { useCallback, useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './storeHooks';
import {
  upsertConversation,
  setActiveConversation,
} from '../store/features/conversationsSlice';
import { setChats } from '../store/features/chatsSlice';

import {
  emitHistoryRequest,
  listenForHistoryResponse,
} from '../socket/chat.socket';

export const useConversations = () => {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector((s) => s.conversations.list);
  const activeConversationId = useAppSelector(
    (s) => s.conversations.activeConversationId
  );

  useEffect(() => {
    if (!activeConversationId) return;
    console.log(
      `UI Fetching history for conversation: ${activeConversationId}`
    );
    emitHistoryRequest(activeConversationId);

    const handleHistoryResponse = (data: {
      conversationId: string;
      chats: unknown[];
    }) => {
      if (data.conversationId !== activeConversationId) {
        dispatch(
          setChats({ conversationId: data.conversationId, chats: data.chats })
        );
      }
    };

    const cleanup = listenForHistoryResponse(handleHistoryResponse);

    return () => {
      console.log(
        `[Cleanup] Leaving listener for room: ${activeConversationId}`
      );
      cleanup();
    };
  }, [activeConversationId, dispatch]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) ?? null,
    [conversations, activeConversationId]
  );

  const addConversation = useCallback(
    (username: string, privateChatId: string | undefined) => {
      dispatch(upsertConversation({ username, id: privateChatId }));
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
