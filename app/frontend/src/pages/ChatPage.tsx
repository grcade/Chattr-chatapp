import React, { useEffect } from 'react';
import useUser from '../hooks/useUser';
import useChatRequests from '../hooks/useChatRequests';
import useConversations from '../hooks/useConversations';
import MainLayout from '../components/layout/MainLayout';
import Sidebar from '../components/chat/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';

/**
 * ChatPage is the main entry point for the chat application interface.
 * It orchestrates the layout and the high-level logic for conversations and requests.
 */
const ChatPage: React.FC = () => {
  const { user } = useUser();
  const { sent, inbox } = useChatRequests();
  const { addConversation, activeConversation } = useConversations();

  /**
   * Effect to automatically add conversations when a chat request is accepted.
   * This ensures that as soon as a request status changes to 'accepted',
   * the user appears in the conversation list.
   */
  useEffect(() => {
    if (!user.username) return;

    // Filter all requests (sent and received) that are accepted
    const acceptedRequests = [...sent, ...inbox].filter(
      (req) => req.status === 'accepted'
    );

    acceptedRequests.forEach((req) => {
      if (req.type === 'group') {
        const groupLabel = req.groupName?.trim() || 'Group chat';

        if (req.conversationId) {
          addConversation(groupLabel, req.conversationId);
        }

        return;
      }

      // Determine the username of the other participant
      const otherUser: string | string[] =
        req.from === user.username ? req.to : req.from;
      const privateChatUser: string | null = Array.isArray(otherUser)
        ? null
        : otherUser;

      if (privateChatUser && privateChatUser !== user.username) {
        addConversation(
          privateChatUser,
          req.conversationId ?? req.privateChatId
        );
      }
    });
  }, [user.username, sent, inbox, addConversation]);

  return (
    <MainLayout
      sidebar={<Sidebar />}
      title={
        activeConversation
          ? `Chat with ${activeConversation.username}`
          : 'Chattr'
      }
    >
      <ChatWindow />
    </MainLayout>
  );
};

export default ChatPage;
