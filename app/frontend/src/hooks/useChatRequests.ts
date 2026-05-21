import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './storeHooks';
import {
  sendJoinRequest,
  recieveJoinRequest,
  setInboxRequestStatus,
  type ChatJoinRequest,
} from '../store/features/chatRequestsSlice';
import { emitChatRequest, listenForChatRequests } from '../socket/chat.socket';

export const useChatRequests = () => {
  const dispatch = useAppDispatch();
  const sent = useAppSelector((s) => s.chatRequests.sent);
  const inbox = useAppSelector((s) => s.chatRequests.inbox);

  const createJoinRequest = useCallback(
    (from: string, to: string) => {
      const now = Date.now();

      const request: ChatJoinRequest = {
        id: `${from}-${to}-${now}`,
        from,
        to,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      };

      dispatch(sendJoinRequest(request));
      emitChatRequest(request);
    },
    [dispatch]
  );

  const recieveRequest = useCallback(() => {
    return listenForChatRequests((req) => {
      dispatch(recieveJoinRequest(req));
    });
  }, [dispatch]);

  const acceptRequest = useCallback(
    (id: string) => {
      dispatch(setInboxRequestStatus({ id, status: 'accepted' }));
    },
    [dispatch]
  );

  const rejectRequest = useCallback(
    (id: string) => {
      dispatch(setInboxRequestStatus({ id, status: 'rejected' }));
    },
    [dispatch, inbox]
  );

  return {
    sent,
    inbox,
    createJoinRequest,
    recieveRequest,
    acceptRequest,
    rejectRequest,
  } as const;
};

export default useChatRequests;
