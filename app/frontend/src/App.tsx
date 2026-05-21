import { useEffect } from 'react';
import './App.css';

import { socket } from './socket/socket';
import WelcomePage from './pages/WelcomePage';
import ChatPage from './pages/ChatPage';
import { useAppSelector } from './hooks/storeHooks';
import useSocket from './hooks/useSocket';

function App() {
  const user = useAppSelector((s) => s.user);

  useSocket();

  return <>{user.username ? <ChatPage /> : <WelcomePage />}</>;
}

export default App;
