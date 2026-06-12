import React, { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Tabs,
  Tab,
  IconButton,
  Avatar,
  InputBase,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import useConversations from '../../hooks/useConversations';
import useChatRequests from '../../hooks/useChatRequests';
import useUser from '../../hooks/useUser';
import RequestItem from './RequestItem';

const Sidebar: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const { conversations, activeConversation, selectConversation } =
    useConversations();
  const { inbox, sent, createJoinRequest } = useChatRequests();
  const { user } = useUser();
  const [receiverUsername, setReceiverUsername] = useState('');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSendRequest = () => {
    const to = receiverUsername.trim();
    if (to && user.username && to !== user.username) {
      createJoinRequest(user.username, to);
      setReceiverUsername('');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#ffffff',
      }}
    >
      <Box sx={{ p: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
              fontWeight: 600,
            }}
          >
            {user.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user.username}
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: '4px 12px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f1f1f2',
            borderRadius: '20px',
            mb: 1,
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', fontSize: 20, mr: 1 }} />
          <InputBase
            placeholder="Invite user by username..."
            sx={{ flex: 1, fontSize: '0.9rem' }}
            value={receiverUsername}
            onChange={(e) => setReceiverUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendRequest()}
          />
          {receiverUsername && (
            <IconButton
              size="small"
              color="primary"
              onClick={handleSendRequest}
            >
              <PersonAddIcon fontSize="small" />
            </IconButton>
          )}
        </Paper>
      </Box>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          minHeight: 40,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '0.9rem',
            minHeight: 40,
            fontWeight: 500,
            color: 'text.secondary',
          },
          '& .Mui-selected': {
            color: 'primary.main',
          },
        }}
      >
        <Tab label="Chats" />
        <Tab label="Requests" />
      </Tabs>

      <Box sx={{ flexGrow: 1, overflow: 'auto', mt: 1 }}>
        {tabValue === 0 && (
          <List sx={{ p: 0 }}>
            {conversations.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No active conversations.
                </Typography>
              </Box>
            ) : (
              conversations.map((conv) => (
                <ListItem key={conv.conversationId} disablePadding>
                  <ListItemButton
                    selected={
                      activeConversation?.conversationId === conv.conversationId
                    }
                    onClick={() => selectConversation(conv.conversationId)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: '#ffffff',
                        '&:hover': { backgroundColor: 'primary.dark' },
                        '& .MuiTypography-root': { color: '#ffffff' },
                        '& .MuiAvatar-root': {
                          bgcolor: '#ffffff',
                          color: 'primary.main',
                        },
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        mr: 2,
                        bgcolor:
                          activeConversation?.conversationId ===
                          conv.conversationId
                            ? '#ffffff'
                            : '#0088cc1a',
                        color:
                          activeConversation?.conversationId ===
                          conv.conversationId
                            ? 'primary.main'
                            : 'primary.main',
                        width: 48,
                        height: 48,
                        fontSize: '1.2rem',
                        fontWeight: 600,
                      }}
                    >
                      {conv.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            fontSize: '1rem',
                            color:
                              activeConversation?.conversationId ===
                              conv.conversationId
                                ? '#ffffff'
                                : 'text.primary',
                          }}
                        >
                          {conv.username}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.8rem',
                            color:
                              activeConversation?.conversationId ===
                              conv.conversationId
                                ? '#ffffffb3'
                                : 'text.secondary',
                          }}
                        >
                          Tap to open chat
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>
        )}

        {tabValue === 1 && (
          <Box>
            <Typography
              variant="overline"
              sx={{
                px: 2,
                color: 'text.secondary',
                fontWeight: 700,
                mt: 1,
                display: 'block',
              }}
            >
              Incoming
            </Typography>
            <List sx={{ p: 0 }}>
              {inbox.length === 0 ? (
                <ListItem sx={{ px: 2 }}>
                  <ListItemText secondary="Empty" />
                </ListItem>
              ) : (
                inbox.map((req) => (
                  <RequestItem key={req.id} request={req} type="inbox" />
                ))
              )}
            </List>
            <Divider sx={{ my: 1 }} />
            <Typography
              variant="overline"
              sx={{
                px: 2,
                color: 'text.secondary',
                fontWeight: 700,
                display: 'block',
              }}
            >
              Sent
            </Typography>
            <List sx={{ p: 0 }}>
              {sent.length === 0 ? (
                <ListItem sx={{ px: 2 }}>
                  <ListItemText secondary="Empty" />
                </ListItem>
              ) : (
                sent.map((req) => (
                  <RequestItem key={req.id} request={req} type="sent" />
                ))
              )}
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;
