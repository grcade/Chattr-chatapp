import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './storeHooks';
import {
  sendJoinRequest,
  recieveJoinRequest,
  setInboxRequestStatus,
  type ChatJoinRequest,
  type ChatJoinResponse,
} from '../store/features/chatRequestsSlice';
import {
  emitChatRequest,
  listenForChatRequests,
  emitChatResponse,
  listenForChatResponses,
} from '../socket/chat.socket';

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
    (request: ChatJoinRequest) => {
      emitChatResponse(request, 'accepted');
      dispatch(setInboxRequestStatus({ id: request.id, status: 'accepted' }));
    },
    [dispatch]
  );

  const watchingforResponses = useCallback(() => {
    return listenForChatResponses((res: ChatJoinResponse) => {
      // console.log('---this is the response----', res);
      dispatch(
        setInboxRequestStatus({
          id: res.id,
          status: res.status,
          conversationId: res.conversationId ?? res.privateChatId,
          privateChatId: res.privateChatId,
        })
      );
    });
  }, [dispatch]);

  const rejectRequest = useCallback(
    (request: ChatJoinRequest) => {
      emitChatResponse(request, 'rejected');
      dispatch(setInboxRequestStatus({ id: request.id, status: 'rejected' }));
    },
    [dispatch]
  );

  return {
    sent,
    inbox,
    createJoinRequest,
    recieveRequest,
    acceptRequest,
    rejectRequest,
    watchingforResponses,
  } as const;
};

export default useChatRequests;
