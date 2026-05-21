import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './storeHooks';
import {
  upsertConversation,
  setActiveConversation,
} from '../store/features/conversationsSlice';

export const useConversations = () => {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector((s) => s.conversations.list);
  const activeConversationId = useAppSelector(
    (s) => s.conversations.activeConversationId
  );

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) ?? null,
    [conversations, activeConversationId]
  );

  const addConversation = useCallback(
    (username: string) => {
      dispatch(upsertConversation({ username }));
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
