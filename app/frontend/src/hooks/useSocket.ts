import { useEffect } from 'react';
import { useAppSelector } from './storeHooks';
import { socket } from '../socket/socket';
import { connectSocket } from '../socket/chat.socket';
import useChatRequests from './useChatRequests';

const useSocket = () => {
  // This hook can be expanded to include more socket-related logic, such as event listeners, emitters, etc.

  const user = useAppSelector((s) => s.user);
  const { recieveRequest } = useChatRequests();

  useEffect(() => {
    // This effect can be used to set up socket event listeners or emitters based on user or chat request changes
    // For example, you could emit a "user:online" event when the user logs in, or listen for incoming chat requests

    // as the user user logs in the socket connection is established in the App.tsx, so we can set up event listeners here that depend on the user being connected
    try {
      connectSocket(user.username);

      const cleanupRecieveRequest = recieveRequest();

      return () => {
        socket.off('connect');
        socket.off('disconnect');
        cleanupRecieveRequest();
      };
    } catch (error) {
      console.error('Error occurred while setting up socket:', error);
    }
  }, [user.username]);

  return {
    socket,
  };
};

export default useSocket;
