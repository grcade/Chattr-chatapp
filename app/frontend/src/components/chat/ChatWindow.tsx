import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, IconButton, InputBase } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import useUser from '../../hooks/useUser';
import useConversations from '../../hooks/useConversations';
import { socket } from '../../socket/socket';

type UiMessage = { id: string; username?: string | null; text: string };

const ChatWindow: React.FC = () => {
  const { user } = useUser();
  const { activeConversation } = useConversations();
  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, UiMessage[]>
  >({});
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (msg: any) => {
      const payload = typeof msg === 'string' ? { text: msg } : msg;
      const targetConversationId = activeConversation?.id;
      if (!targetConversationId) return;

      const incoming: UiMessage = {
        id: String(Date.now()),
        username: payload.username ?? null,
        text: payload.text ?? String(payload),
      };

      setMessagesByConversation((prev) => ({
        ...prev,
        [targetConversationId]: [
          ...(prev[targetConversationId] ?? []),
          incoming,
        ],
      }));
    };

    socket.on('message', handler);
    return () => {
      socket.off('message', handler);
    };
  }, [activeConversation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messagesByConversation, activeConversation]);

  const handleSendMessage = () => {
    if (!activeConversation || !text.trim()) return;

    const payload = {
      username: user.username,
      to: activeConversation.username,
      text: text.trim(),
    };

    socket.emit('message', payload);

    const outgoing: UiMessage = {
      id: String(Date.now()),
      username: user.username,
      text: text.trim(),
    };

    setMessagesByConversation((prev) => ({
      ...prev,
      [activeConversation.id]: [
        ...(prev[activeConversation.id] ?? []),
        outgoing,
      ],
    }));

    setText('');
  };

  if (!activeConversation) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          backgroundColor: '#f4f4f5',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            px: 2,
            py: 1,
            backgroundColor: '#0000001a',
            borderRadius: '20px',
            color: '#707579',
          }}
        >
          Select a chat to start messaging
        </Typography>
      </Box>
    );
  }

  const messages = messagesByConversation[activeConversation.id] ?? [];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#f4f4f5',
        position: 'relative',
      }}
    >
      <Box
        ref={scrollRef}
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        <Box sx={{ flexGrow: 1 }} />
        {messages.map((msg) => {
          const isMine = msg.username === user.username;
          return (
            <Box
              key={msg.id}
              sx={{
                alignSelf: isMine ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: '8px 14px',
                  backgroundColor: isMine ? '#effdde' : '#ffffff',
                  color: '#222222',
                  borderRadius: isMine
                    ? '14px 14px 2px 14px'
                    : '14px 14px 14px 2px',
                  position: 'relative',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                {!isMine && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mb: 0.5,
                      fontWeight: 700,
                      color: 'primary.main',
                      fontSize: '0.8rem',
                    }}
                  >
                    {msg.username}
                  </Typography>
                )}
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '0.95rem',
                    lineHeight: 1.4,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.text}
                </Typography>
              </Paper>
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          p: 2,
          backgroundColor: 'transparent',
          width: '100%',
          maxWidth: '800px',
          alignSelf: 'center',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: '4px 8px 4px 16px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          <InputBase
            fullWidth
            multiline
            maxRows={4}
            placeholder="Write a message..."
            sx={{ flex: 1, fontSize: '1rem' }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!text.trim()}
            sx={{ p: '8px' }}
          >
            <SendIcon />
          </IconButton>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatWindow;
