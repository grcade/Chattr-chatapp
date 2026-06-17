import React from 'react';
import {
  ListItem,
  ListItemText,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Avatar,
  Typography,
} from '@mui/material';
import type { ChipProps } from '@mui/material/Chip';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import useChatRequests from '../../hooks/useChatRequests';
import type { ChatJoinRequest } from '../../store/features/chatRequestsSlice';

interface RequestItemProps {
  request: ChatJoinRequest;
  type: 'inbox' | 'sent';
}

const formatRequestTarget = (target: string | string[]): string =>
  Array.isArray(target) ? target.join(', ') : target;

const getAvatarLabel = (value: string | string[]) => {
  const normalized = Array.isArray(value) ? value.join(', ') : value;
  return normalized.slice(0, 1).toUpperCase() || '?';
};

const RequestItem: React.FC<RequestItemProps> = ({ request, type }) => {
  const { acceptRequest, rejectRequest } = useChatRequests();

  const getStatusColor = (
    status: ChatJoinRequest['status']
  ): ChipProps['color'] => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  const username: string =
    request.type === 'group'
      ? request.groupName?.trim() || 'Group chat'
      : type === 'inbox'
        ? String(request.from)
        : formatRequestTarget(request.to);
  const avatarLabel = getAvatarLabel(
    request.type === 'group'
      ? request.groupName?.trim() || request.from
      : type === 'inbox'
        ? request.from
        : request.to
  );

  return (
    <ListItem
      divider
      sx={{
        py: 1.5,
        px: 2,
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <Avatar
        sx={{
          mr: 2,
          bgcolor: '#0088cc1a',
          color: 'primary.main',
          width: 40,
          height: 40,
          fontSize: '1rem',
          fontWeight: 600,
        }}
      >
        {avatarLabel}
      </Avatar>
      <ListItemText
        primary={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {username}
            </Typography>
            <Chip
              label={request.status}
              size="small"
              color={getStatusColor(request.status)}
              variant="outlined"
              sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }}
            />
          </Box>
        }
        secondary={
          <Typography
            component="span"
            variant="body2"
            sx={{ fontSize: '0.8rem', color: 'text.secondary' }}
          >
            {type === 'inbox' ? 'Wants to chat' : 'Request sent'}
          </Typography>
        }
      />
      {type === 'inbox' && request.status === 'pending' && (
        <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
          <Tooltip title="Accept">
            <IconButton
              size="small"
              sx={{
                color: 'success.main',
                backgroundColor: '#e8f5e9',
                '&:hover': { backgroundColor: '#c8e6c9' },
              }}
              onClick={() => acceptRequest(request)}
            >
              <CheckIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject">
            <IconButton
              size="small"
              sx={{
                color: 'error.main',
                backgroundColor: '#ffeebf1a',
                '&:hover': { backgroundColor: '#ffcdd2' },
              }}
              onClick={() => rejectRequest(request)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </ListItem>
  );
};

export default RequestItem;
