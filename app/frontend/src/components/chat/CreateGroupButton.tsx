import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { GroupAdd } from '@mui/icons-material';
import { useAppSelector } from '../../hooks/storeHooks';
import useUser from '../../hooks/useUser';
import useChatRequests from '../../hooks/useChatRequests';

function CreateGroupButton() {
  const friends = useAppSelector((state) => state.conversations.list);
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const { createJoinRequest } = useChatRequests();

  const handleCreate = () => {
    console.log({
      groupName,
      members: selectedMembers,
    });

    if (!user.username) return;

    createJoinRequest(user.username, selectedMembers, 'group', groupName);

    setGroupName('');
    setSelectedMembers([]);

    setOpen(false);
  };

  const sx = {
    position: 'absolute',
    bottom: 24, // Matches bottom-6 (6 * 4px = 24px)
    right: 24, // Matches right-6
    zIndex: 50,
    width: '300px',
    height: '50px',
    backgroundColor: 'primary.main', // Uses your theme color, or a hardcoded string like '#2563eb'
    color: 'white',
    padding: 2, // Matches p-4 (2 * 8px = 16px)
    borderRadius: '9999px', // Matches rounded-full
    boxShadow: 6, // Matches shadow-xl theme shadow
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: 'primary.dark', // Matches hover:bg-blue-700, or a hardcoded hex
    },
  };
  return (
    <>
      <Button
        variant="contained"
        startIcon={<GroupAdd />}
        fullWidth
        onClick={() => setOpen(true)}
        sx={sx}
      >
        Create Group
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create Group Chat</DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <ToggleButtonGroup
              value={selectedMembers}
              color="primary"
              onChange={(_, newMembers) => setSelectedMembers(newMembers)}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              {friends.map((friend) => (
                //   console.log('friend----------->', friend),
                <ToggleButton key={friend.id} value={friend.username}>
                  {friend.username}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CreateGroupButton;
